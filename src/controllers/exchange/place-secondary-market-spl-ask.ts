/* eslint-disable max-len */
import _ from "lodash"
import { Request, Response } from "express"
import { PublicKey } from "@solana/web3.js"
import SolPriceManager from "../../classes/sol-price-manager"
import addSecondaryMarketAsk from "../../db-operations/write/secondary-market/add-secondary-market-ask"
import transferSolFunction from "../../utils/exchange/purchase-primary-spl-tokens/transfer-sol-function"
import { updateSecondaryMarketAskSet } from "../../db-operations/write/secondary-market/update-secondary-market-ask"
import secondarySplTokenTransfer from "../../utils/exchange/purchase-secondary-spl-tokens/secondary-spl-token-transfer"
import addSecondaryMarketTransaction from "../../db-operations/write/secondary-market/add-secondary-market-transaction"
import retrieveBidsAboveCertainPrice from "../../db-operations/read/secondary-market/retrieve-bids-above-certain-price"
import { updateSecondaryMarketBidDecrement } from "../../db-operations/write/secondary-market/update-secondary-market-bid"

export default async function placeSecondaryMarketSplAsk(req: Request, res: Response): Promise<Response> {
	try {
		const { splDetails, solanaWallet} = req
		const createSplAskData = req.body.createSplAsk as CreateSplAskData

		const askId = await addSecondaryMarketAsk(splDetails.splId, solanaWallet.solana_wallet_id, createSplAskData)

		const retrievedBids = await retrieveBidsAboveCertainPrice(splDetails.splId, createSplAskData.askPricePerShareUsd)

		if (_.isEmpty(retrievedBids)) return res.status(200).json({ success: "Added bid, no asks yet" })

		let numberOfRemainingSharesToSell = createSplAskData.numberOfSharesAskingFor
		for (const bid of retrievedBids) {
			if (numberOfRemainingSharesToSell === 0) break
			let amountToSell: number = numberOfRemainingSharesToSell
			if (numberOfRemainingSharesToSell > bid.remaining_number_of_shares_bidding_for) {
				amountToSell = bid.remaining_number_of_shares_bidding_for
			}
			// Transfer SPL tokens:
			const splTransferId = await secondarySplTokenTransfer(solanaWallet, bid.solana_wallet, amountToSell, new PublicKey(splDetails.publicKeyAddress), splDetails.splId)

			// Transfer Sol:
			const solPrice = (await SolPriceManager.getInstance().getPrice()).price
			const solTransferId = await transferSolFunction(
				bid.solana_wallet,
				{ public_key: new PublicKey(solanaWallet.public_key), solana_wallet_id: solanaWallet.solana_wallet_id},
				{
					solToTransfer: amountToSell * bid.bid_price_per_share_usd / solPrice,
					usdToTransfer: amountToSell * bid.bid_price_per_share_usd,
					defaultCurrency: "usd"
				}
			)
			// update the bid records
			await updateSecondaryMarketBidDecrement(bid.secondary_market_bid_id, amountToSell)

			// add a record to the secondary_transaction_table.
			await addSecondaryMarketTransaction(askId, bid.secondary_market_bid_id, solTransferId, splTransferId)
			numberOfRemainingSharesToSell -= amountToSell
		}

		// update the bid record (update for the number of available shares.)
		await updateSecondaryMarketAskSet(askId, numberOfRemainingSharesToSell)

		return res.status(200).json({ success: "" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to create Spl Ask" })
	}
}
