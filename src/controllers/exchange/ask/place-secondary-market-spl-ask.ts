/* eslint-disable max-depth */
import _ from "lodash"
import { Request, Response } from "express"
import { PublicKey } from "@solana/web3.js"
import SolPriceManager from "../../../classes/sol-price-manager"
import transferSolFunction from "../../../utils/exchange/transfer-sol-function"
import { getWalletBalanceWithUSD } from "../../../utils/solana/get-wallet-balance"
import calculateAverageFillPrice from "../../../utils/exchange/calculate-average-fill-price"
import retrieveSplOwnershipByWalletIdAndSplId
	from "../../../db-operations/read/spl-ownership/retrieve-spl-ownership-by-wallet-id-and-spl-id"
import updateSplTransferRecordWithTransactionId
	from "../../../db-operations/write/spl/spl-transfer/update-spl-transfer-record-with-transaction-id"
import addSecondaryMarketAsk from "../../../db-operations/write/secondary-market/ask/add-secondary-market-ask"
import updateBidStatusOnWalletBalanceChange from "../../../utils/exchange/update-bid-status-on-wallet-balance-change"
import addSecondaryMarketTransaction from "../../../db-operations/write/secondary-market/add-secondary-market-transaction"
import { updateSecondaryMarketAskSet } from "../../../db-operations/write/secondary-market/ask/update-secondary-market-ask"
import retrieveBidsAboveCertainPrice from "../../../db-operations/read/secondary-market/bid/retrieve-bids-above-certain-price"
import { updateSecondaryMarketBidDecrement } from "../../../db-operations/write/secondary-market/bid/update-secondary-market-bid"
import addSplTransferRecordAndUpdateOwnership from "../../../db-operations/write/simultaneous-writes/add-spl-transfer-and-update-ownership"

// eslint-disable-next-line max-lines-per-function, complexity
export default async function placeSecondaryMarketSplAsk(req: Request, res: Response): Promise<Response> {
	try {
		const { splDetails, solanaWallet} = req
		const createSplAskData = req.body.createSplAsk as CreateSplAskData

		const askId = await addSecondaryMarketAsk(splDetails.splId, solanaWallet.solana_wallet_id, createSplAskData)

		const retrievedBids = await retrieveBidsAboveCertainPrice(splDetails.splId, createSplAskData.askPricePerShareUsd)

		if (_.isEmpty(retrievedBids)) return res.status(200).json({ success: "Added bid, no asks yet" })

		let numberOfRemainingSharesToSell = createSplAskData.numberOfSharesAskingFor
		const transactionsMap: TransactionsMap[] = []
		for (const bid of retrievedBids) {
			if (numberOfRemainingSharesToSell === 0) break
			if (_.isEqual(solanaWallet.solana_wallet_id, bid.solana_wallet.solana_wallet_id)) continue

			let numberSharesToSell: number = numberOfRemainingSharesToSell
			if (numberOfRemainingSharesToSell > bid.remaining_number_of_shares_bidding_for) {
				numberSharesToSell = bid.remaining_number_of_shares_bidding_for
			}
			const bidderWalletBalanceUsd = await getWalletBalanceWithUSD(new PublicKey(solanaWallet.public_key))
			const sharesBidderAbleToBuy = bidderWalletBalanceUsd.balanceInUsd / bid.bid_price_per_share_usd
			numberSharesToSell = Math.min(numberSharesToSell, sharesBidderAbleToBuy)

			if (numberSharesToSell === 0) break
			// Transfer SPL tokens:

			const bidderOwnershipData = await retrieveSplOwnershipByWalletIdAndSplId(
				bid.solana_wallet.solana_wallet_id,
				splDetails.publicKeyAddress
			)
			let sharesTransferred = 0
			const splTransferIds = []
			for (const singleBidderOwnershipData of bidderOwnershipData) {
				const sharesToTransfer = Math.min(numberSharesToSell - sharesTransferred, singleBidderOwnershipData.number_of_shares)
				if (sharesToTransfer === 0) break

				const splTransferId = await addSplTransferRecordAndUpdateOwnership(
					splDetails.splId,
					bid.solana_wallet.solana_wallet_id,
					solanaWallet.solana_wallet_id,
					true,
					true,
					numberSharesToSell,
					bid.bid_price_per_share_usd,
					singleBidderOwnershipData.spl_ownership_id
				)
				sharesTransferred += sharesToTransfer
				splTransferIds.push(splTransferId)
			}

			// Transfer Sol:
			const solPrice = (await SolPriceManager.getInstance().getPrice()).price
			const solTransferId = await transferSolFunction(
				bid.solana_wallet,
				{ public_key: new PublicKey(solanaWallet.public_key), solana_wallet_id: solanaWallet.solana_wallet_id},
				{
					solToTransfer: numberSharesToSell * bid.bid_price_per_share_usd / solPrice,
					usdToTransfer: numberSharesToSell * bid.bid_price_per_share_usd,
					defaultCurrency: "usd"
				}
			)
			// update the bid records
			await updateSecondaryMarketBidDecrement(bid.secondary_market_bid_id, numberSharesToSell)

			// add a record to the secondary_transaction_table.
			const secondaryMarketTransactionId = await addSecondaryMarketTransaction(bid.secondary_market_bid_id, askId, solTransferId)
			await updateSplTransferRecordWithTransactionId(splTransferIds, secondaryMarketTransactionId)

			transactionsMap.push({ fillPriceUsd: bid.bid_price_per_share_usd, numberOfShares: numberSharesToSell })
			await updateBidStatusOnWalletBalanceChange(bid.solana_wallet)
			numberOfRemainingSharesToSell -= numberSharesToSell
		}

		// update the bid record (update for the number of available shares.)
		await updateSecondaryMarketAskSet(askId, numberOfRemainingSharesToSell)

		const sharesSold = createSplAskData.numberOfSharesAskingFor - numberOfRemainingSharesToSell
		const averageFillPrice = calculateAverageFillPrice(transactionsMap)
		return res.status(200).json({
			sharesSold,
			averageFillPrice,
			transactionsMap
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to create Spl Ask" })
	}
}
