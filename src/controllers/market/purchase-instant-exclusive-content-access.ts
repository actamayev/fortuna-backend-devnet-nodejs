import _ from "lodash"
import { Request, Response } from "express"
import SolPriceManager from "../../classes/sol-price-manager"
import VideoUrlsManager from "../../classes/video-urls-manager"
import transferSolFunction from "../../utils/solana/transfer-sol-function"
import retrieveCreatorWalletInfoFromVideo from "../../db-operations/read/video/retrieve-creator-wallet-info-from-video"
import addExclusiveVideoAcceslPurchase from "../../db-operations/write/exclusive-video-access-purchase/add-exclusive-video-access-purchase"

export default async function purchaseInstantExclusiveContentAccess(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet, exclusiveVideoData } = req

		const creatorWalletInfo = await retrieveCreatorWalletInfoFromVideo(exclusiveVideoData.video_id)
		if (_.isNull(creatorWalletInfo)) return res.status(500).json({ error: "Unable to find creator's public key" })

		const solPrice = (await SolPriceManager.getInstance().getPrice()).price

		const transferCurrencyAmounts = {
			usdPriceToTransferAt: exclusiveVideoData.listing_price_to_access_usd,
			solPriceToTransferAt: exclusiveVideoData.listing_price_to_access_usd / solPrice
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

		await addExclusiveVideoAcceslPurchase(exclusiveVideoData.video_id, solanaWallet.solana_wallet_id, solTransferId)
		const videoUrl = await VideoUrlsManager.getInstance().getVideoUrl(exclusiveVideoData.uuid)

		return res.status(200).json({ videoUrl })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to purchase exclusive content" })
	}
}
