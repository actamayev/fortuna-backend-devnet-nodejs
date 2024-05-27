import _ from "lodash"
import { Request, Response } from "express"
import { PublicKey } from "@solana/web3.js"
import SolPriceManager from "../../../classes/sol-price-manager"
import transferSolFunction from "../../../utils/exchange/transfer-sol-function"
import { getWalletBalanceWithUSD } from "../../../utils/solana/get-wallet-balance"
import createAskOrderDataToReturn from "../../../utils/exchange/create-ask-order-data-to-return"
import { updateSplTransferRecordWithTransactionId }
	from "../../../db-operations/write/spl/spl-transfer/update-spl-transfer-record-with-transaction-id"
import retrieveSplOwnershipByWalletIdAndSplPublicKey
	from "../../../db-operations/read/spl-ownership/retrieve-spl-ownership-by-wallet-id-and-spl-public-key"
import addSecondaryMarketAsk from "../../../db-operations/write/secondary-market/ask/add-secondary-market-ask"
import updateBidStatusOnWalletBalanceChange from "../../../utils/exchange/update-bid-status-on-wallet-balance-change"
import addSecondaryMarketTransaction from "../../../db-operations/write/secondary-market/add-secondary-market-transaction"
import { updateSecondaryMarketAskSet } from "../../../db-operations/write/secondary-market/ask/update-secondary-market-ask"
import retrieveBidsAboveCertainPrice from "../../../db-operations/read/secondary-market/bid/retrieve-bids-above-certain-price"
import { updateSecondaryMarketBidDecrement } from "../../../db-operations/write/secondary-market/bid/update-secondary-market-bid"
import addSplTransferRecordAndUpdateOwnership from "../../../db-operations/write/simultaneous-writes/add-spl-transfer-and-update-ownership"

// eslint-disable-next-line max-lines-per-function
export default async function placeSplAsk(req: Request, res: Response): Promise<Response> {
	try {
		const { splDetails, solanaWallet} = req
		const createSplAskData = req.body.createSplAsk as CreateSplAskData

		const askId = await addSecondaryMarketAsk(splDetails.splId, solanaWallet.solana_wallet_id, createSplAskData)

		const retrievedBids = await retrieveBidsAboveCertainPrice(
			splDetails.splId,
			createSplAskData.askPricePerShareUsd,
			solanaWallet.solana_wallet_id
		)

		if (_.isEmpty(retrievedBids)) {
			const askOrderData = createAskOrderDataToReturn(askId, splDetails, createSplAskData, createSplAskData.numberOfSharesAskingFor)
			return res.status(200).json({ askOrderData, averageFillPrice: { sharesTransacted: 0, averageFillPrice: 0 }})
		}

		let numberOfRemainingSharesToSell = createSplAskData.numberOfSharesAskingFor
		const transactionsMap: TransactionsMap[] = []
		const askerOwnershipData = await retrieveSplOwnershipByWalletIdAndSplPublicKey(
			solanaWallet.solana_wallet_id,
			splDetails.publicKeyAddress
		)

		while (numberOfRemainingSharesToSell > 0 && !_.isEmpty(retrievedBids) && !_.isEmpty(askerOwnershipData)) {
			const remainingSharesInBid = retrievedBids[0].remaining_number_of_shares_bidding_for
			const bidPricePerShare  = retrievedBids[0].bid_price_per_share_usd
			const sharesOwnedByAsker = askerOwnershipData[0].number_of_shares

			const bidderWalletBalanceUsd = await getWalletBalanceWithUSD(new PublicKey(solanaWallet.public_key))
			const sharesBidderAbleToBuy = bidderWalletBalanceUsd.balanceInUsd / bidPricePerShare

			// Calculate the minimum shares to transfer
			const sharesToTransfer = Math.min(
				remainingSharesInBid,
				sharesOwnedByAsker,
				numberOfRemainingSharesToSell,
				sharesBidderAbleToBuy
			)

			if (sharesToTransfer === 0) break

			const splTransferId = await addSplTransferRecordAndUpdateOwnership(
				splDetails.splId,
				retrievedBids[0].solana_wallet.solana_wallet_id,
				solanaWallet.solana_wallet_id,
				true,
				true,
				sharesToTransfer,
				bidPricePerShare,
				askerOwnershipData[0].spl_ownership_id
			)

			const solPrice = (await SolPriceManager.getInstance().getPrice()).price
			const solTransferId = await transferSolFunction(
				retrievedBids[0].solana_wallet,
				{ public_key: new PublicKey(solanaWallet.public_key), solana_wallet_id: solanaWallet.solana_wallet_id},
				{
					solToTransfer: sharesToTransfer * bidPricePerShare / solPrice,
					usdToTransfer: sharesToTransfer * bidPricePerShare,
					defaultCurrency: "usd"
				}
			)

			await updateSecondaryMarketBidDecrement(retrievedBids[0].secondary_market_bid_id, sharesToTransfer)

			// add a record to the secondary_transaction_table.
			const secondaryMarketTransactionId = await addSecondaryMarketTransaction(
				retrievedBids[0].secondary_market_bid_id,
				askId,
				solTransferId
			)
			await updateSplTransferRecordWithTransactionId(splTransferId, secondaryMarketTransactionId)

			await updateBidStatusOnWalletBalanceChange(retrievedBids[0].solana_wallet)

			retrievedBids[0].remaining_number_of_shares_bidding_for -= sharesToTransfer
			// eslint-disable-next-line max-len
			askerOwnershipData[0].number_of_shares -= sharesToTransfer
			if (_.isEqual(retrievedBids[0].remaining_number_of_shares_bidding_for, 0)) {
				retrievedBids.shift()
			}
			if (_.isEqual(askerOwnershipData[0].number_of_shares, 0)) {
				askerOwnershipData.shift()
			}
			transactionsMap.push({ fillPriceUsd: bidPricePerShare, numberOfShares: sharesToTransfer })
			numberOfRemainingSharesToSell -= sharesToTransfer
		}

		// update the bid record (update for the number of available shares.)
		await updateSecondaryMarketAskSet(askId, numberOfRemainingSharesToSell)

		const askOrderData = createAskOrderDataToReturn(askId, splDetails, createSplAskData, numberOfRemainingSharesToSell)
		return res.status(200).json({ askOrderData, transactionsMap })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to create Spl Ask" })
	}
}
