import _ from "lodash"
import { Request, Response } from "express"
import { PublicKey } from "@solana/web3.js"
import SolPriceManager from "../../classes/sol-price-manager"
import transferSolFunction from "../../utils/exchange/transfer-sol-function"
import calculateAverageFillPrice from "../../utils/exchange/calculate-average-fill-price"
import addSecondaryMarketBid from "../../db-operations/write/secondary-market/add-secondary-market-bid"
import updateBidStatusOnWalletBalanceChange from "../../utils/exchange/update-bid-status-on-wallet-balance-change"
import { updateSecondaryMarketBidSet } from "../../db-operations/write/secondary-market/update-secondary-market-bid"
import addSecondaryMarketTransaction from "../../db-operations/write/secondary-market/add-secondary-market-transaction"
import retrieveAsksBelowCertainPrice from "../../db-operations/read/secondary-market/retrieve-asks-below-certain-price"
import { updateSecondaryMarketAskDecrement } from "../../db-operations/write/secondary-market/update-secondary-market-ask"
import addSplTransferRecordAndUpdateOwnership from "../../db-operations/write/simultaneous-writes/add-spl-transfer-and-update-ownership"

// eslint-disable-next-line max-lines-per-function
export default async function placeSecondaryMarketSplBid(req: Request, res: Response): Promise<Response> {
	try {
		const { splDetails, solanaWallet } = req
		const createSplBidData = req.body.createSplBid as CreateSplBidData

		const bidId = await addSecondaryMarketBid(splDetails.splId, solanaWallet.solana_wallet_id, createSplBidData)

		const retrievedAsks = await retrieveAsksBelowCertainPrice(splDetails.splId, createSplBidData.bidPricePerShareUsd)

		if (_.isEmpty(retrievedAsks)) return res.status(200).json({ success: "Added bid, no asks yet" })

		let numberOfRemainingSharesToBuy = createSplBidData.numberOfSharesBiddingFor
		const transactionsMap: TransactionsMap[] = []
		for (const ask of retrievedAsks) {
			if (numberOfRemainingSharesToBuy === 0) break
			if (_.isEqual(solanaWallet.solana_wallet_id, ask.solana_wallet.solana_wallet_id)) continue

			let amountToBuy: number = numberOfRemainingSharesToBuy
			if (numberOfRemainingSharesToBuy > ask.remaining_number_of_shares_for_sale) {
				amountToBuy = ask.remaining_number_of_shares_for_sale
			}
			// Transfer SPL tokens:
			const splTransferId = await addSplTransferRecordAndUpdateOwnership(
				splDetails.splId,
				solanaWallet.solana_wallet_id,
				ask.solana_wallet.solana_wallet_id,
				true,
				true,
				amountToBuy
			)

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
			await addSecondaryMarketTransaction(bidId, ask.secondary_market_ask_id, solTransferId, splTransferId)
			transactionsMap.push({ fillPriceUsd: ask.ask_price_per_share_usd, numberOfShares: amountToBuy})
			numberOfRemainingSharesToBuy -= amountToBuy
		}

		// update the bid record (update for the number of available shares.)
		await updateSecondaryMarketBidSet(bidId, numberOfRemainingSharesToBuy)

		await updateBidStatusOnWalletBalanceChange(solanaWallet)
		const sharesPurchased = createSplBidData.numberOfSharesBiddingFor - numberOfRemainingSharesToBuy
		const averageFillPrice = calculateAverageFillPrice(transactionsMap)
		return res.status(200).json({
			sharesPurchased,
			averageFillPrice,
			transactionsMap
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to create Spl Bid" })
	}
}
