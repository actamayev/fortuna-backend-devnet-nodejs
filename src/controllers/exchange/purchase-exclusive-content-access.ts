import _ from "lodash"
import { Request, Response } from "express"
import SolPriceManager from "../../classes/sol-price-manager"
import VideoUrlsManager from "../../classes/video-urls-manager"
import transferSolFunction from "../../utils/exchange/transfer-sol-function"
import retrieveCreatorWalletInfoFromSpl from "../../db-operations/read/spl/retrieve-creator-wallet-info-from-spl"
import addExclusiveSplPurchase from "../../db-operations/write/exclusive-spl-purchase/add-exclusive-spl-purchase"

export default async function purchaseExclusiveContentAccess(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet, exclusiveVideoData } = req

		const creatorWalletInfo = await retrieveCreatorWalletInfoFromSpl(exclusiveVideoData.spl_id)
		if (_.isNull(creatorWalletInfo)) return res.status(500).json({ error: "Unable to find creator's public key" })

		const solPrice = (await SolPriceManager.getInstance().getPrice()).price

		const transferCurrencyAmounts = {
			usdPriceToTransferAt: exclusiveVideoData.instant_access_price_to_exclusive_content_usd,
			solPriceToTransferAt: exclusiveVideoData.instant_access_price_to_exclusive_content_usd / solPrice
		}

		const solTransferId = await transferSolFunction(
			solanaWallet,
			creatorWalletInfo,
			{
				solToTransfer: transferCurrencyAmounts.solPriceToTransferAt,
				usdToTransfer: transferCurrencyAmounts.usdPriceToTransferAt,
				defaultCurrency: "usd"
			}
		)

		await addExclusiveSplPurchase(exclusiveVideoData.spl_id, solanaWallet.solana_wallet_id, solTransferId)
		const videoUrl = await VideoUrlsManager.getInstance().getVideoUrl(exclusiveVideoData.uuid)

		return res.status(200).json({ videoUrl })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to purchase exclusive content" })
	}
}
