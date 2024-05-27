import _ from "lodash"
import { Request, Response } from "express"
import { PublicKey } from "@solana/web3.js"
import SolPriceManager from "../../../classes/sol-price-manager"
import transferSolFunction from "../../../utils/exchange/transfer-sol-function"
import createBidOrderDataToReturn from "../../../utils/exchange/create-bid-order-data-to-return"
import { updateSplTransferRecordsWithTransactionId }
	from "../../../db-operations/write/spl/spl-transfer/update-spl-transfer-record-with-transaction-id"
import retrieveSplOwnershipByWalletIdAndSplPublicKey
	from "../../../db-operations/read/spl-ownership/retrieve-spl-ownership-by-wallet-id-and-spl-public-key"
import addSecondaryMarketBid from "../../../db-operations/write/secondary-market/bid/add-secondary-market-bid"
import updateBidStatusOnWalletBalanceChange from "../../../utils/exchange/update-bid-status-on-wallet-balance-change"
import addSecondaryMarketTransaction from "../../../db-operations/write/secondary-market/add-secondary-market-transaction"
import { updateSecondaryMarketBidSet } from "../../../db-operations/write/secondary-market/bid/update-secondary-market-bid"
import retrieveAsksBelowCertainPrice from "../../../db-operations/read/secondary-market/ask/retrieve-asks-below-certain-price"
import { updateSecondaryMarketAskDecrement } from "../../../db-operations/write/secondary-market/ask/update-secondary-market-ask"
import addSplTransferRecordAndUpdateOwnership from "../../../db-operations/write/simultaneous-writes/add-spl-transfer-and-update-ownership"

// eslint-disable-next-line max-lines-per-function
export default async function placeSplBid(req: Request, res: Response): Promise<Response> {
	try {
		const { splDetails, solanaWallet } = req
		const createSplBidData = req.body.createSplBid as CreateSplBidData

		const bidId = await addSecondaryMarketBid(splDetails.splId, solanaWallet.solana_wallet_id, createSplBidData)

		const retrievedAsks = await retrieveAsksBelowCertainPrice(
			splDetails.splId,
			createSplBidData.bidPricePerShareUsd,
			solanaWallet.solana_wallet_id
		)

		if (_.isEmpty(retrievedAsks)) {
			const bidOrderData = createBidOrderDataToReturn(bidId, splDetails, createSplBidData, createSplBidData.numberOfSharesBiddingFor)
			return res.status(200).json({ bidOrderData, averageFillPrice: { sharesTransacted: 0, averageFillPrice: 0 } })
		}

		let numberOfRemainingSharesToBuy = createSplBidData.numberOfSharesBiddingFor
		const transactionsMap: TransactionsMap[] = []

		for (const ask of retrievedAsks) {
			if (numberOfRemainingSharesToBuy === 0) break

			let amountToBuy: number = numberOfRemainingSharesToBuy
			if (numberOfRemainingSharesToBuy > ask.remaining_number_of_shares_for_sale) {
				amountToBuy = ask.remaining_number_of_shares_for_sale
			}

			// Transfer SPL tokens:
			const askerOwnershipData = await retrieveSplOwnershipByWalletIdAndSplPublicKey(
				ask.solana_wallet.solana_wallet_id,
				splDetails.publicKeyAddress
			)
			let sharesTransferred = 0
			const splTransferIds = []
			for (const singleAskerOwnershipData of askerOwnershipData) {
				const sharesToTransfer = Math.min(amountToBuy - sharesTransferred, singleAskerOwnershipData.number_of_shares)
				// eslint-disable-next-line max-depth
				if (sharesToTransfer === 0) break
				const splTransferId = await addSplTransferRecordAndUpdateOwnership(
					splDetails.splId,
					solanaWallet.solana_wallet_id,
					ask.solana_wallet.solana_wallet_id,
					true,
					true,
					sharesToTransfer,
					ask.ask_price_per_share_usd,
					singleAskerOwnershipData.spl_ownership_id
				)
				sharesTransferred += sharesToTransfer
				splTransferIds.push(splTransferId)
			}

			// Transfer Sol:
			const solPrice = (await SolPriceManager.getInstance().getPrice()).price
			const solTransferId = await transferSolFunction(
				solanaWallet,
				{ public_key: new PublicKey(ask.solana_wallet.public_key), solana_wallet_id: ask.solana_wallet.solana_wallet_id},
				{
					solToTransfer: amountToBuy * ask.ask_price_per_share_usd / solPrice,
					usdToTransfer: amountToBuy * ask.ask_price_per_share_usd,
					defaultCurrency: "usd"
				}
			)
			// update the ask records
			await updateSecondaryMarketAskDecrement(ask.secondary_market_ask_id, amountToBuy)
			// add a record to the secondary_transaction_table.
			const secondaryMarketTransactionId = await addSecondaryMarketTransaction(
				bidId,
				ask.secondary_market_ask_id,
				solTransferId,
			)
			await updateSplTransferRecordsWithTransactionId(splTransferIds, secondaryMarketTransactionId)
			transactionsMap.push({ fillPriceUsd: ask.ask_price_per_share_usd, numberOfShares: amountToBuy })
			numberOfRemainingSharesToBuy -= amountToBuy
		}

		// update the bid record (update for the number of available shares.)
		await updateSecondaryMarketBidSet(bidId, numberOfRemainingSharesToBuy)

		await updateBidStatusOnWalletBalanceChange(solanaWallet)
		const bidOrderData = createBidOrderDataToReturn(bidId, splDetails, createSplBidData, numberOfRemainingSharesToBuy)
		return res.status(200).json({ bidOrderData, transactionsMap })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to create Spl Bid" })
	}
}
