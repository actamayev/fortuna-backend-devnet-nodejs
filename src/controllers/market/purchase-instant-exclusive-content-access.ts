import _ from "lodash"
import { Request, Response } from "express"
import VideoUrlsManager from "../../classes/video-urls-manager"
import SolPriceManager from "../../classes/solana/sol-price-manager"
import transferSolFromFanToCreator from "../../utils/solana/transfer-sol-from-fan-to-creator"
import setNewVideoListingStatus from "../../db-operations/write/video/set-new-video-listing-status"
import transferSolFromCreatorToFortuna from "../../utils/solana/transfer-sol-from-creator-to-fortuna"
import retrieveCreatorWalletInfoFromVideo from "../../db-operations/read/video/retrieve-creator-wallet-info-from-video"
import updateCheckIfVideoAccessTierSoldOut from "../../db-operations/write/video-access-tier/update-check-if-video-access-tier-sold-out"
import addExclusiveVideoAccessPurchase from "../../db-operations/write/exclusive-video-access-purchase/add-exclusive-video-access-purchase"

// eslint-disable-next-line max-lines-per-function
export default async function purchaseInstantExclusiveContentAccess(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet, exclusiveVideoData } = req
		const { tierNumber } = req.body as { tierNumber: string }

		const creatorWalletInfo = await retrieveCreatorWalletInfoFromVideo(exclusiveVideoData.video_id)
		if (_.isNull(creatorWalletInfo)) return res.status(500).json({ error: "Unable to find creator's public key" })

		const solPrice = (await SolPriceManager.getInstance().getPrice()).price

		const transferDetails: TransferDetailsLessDefaultCurrency = {
			usdToTransfer: exclusiveVideoData.tier_access_price_usd,
			solToTransfer: exclusiveVideoData.tier_access_price_usd / solPrice
		}

		const solTransferId = await transferSolFromFanToCreator(
			solanaWallet,
			creatorWalletInfo,
			{
				solToTransfer: transferDetails.solToTransfer * 0.975,
				usdToTransfer: transferDetails.usdToTransfer * 0.975
			}
		)

		const fortunaTakeId = await transferSolFromCreatorToFortuna(
			creatorWalletInfo,
			{
				solToTransfer: transferDetails.solToTransfer * 0.025,
				usdToTransfer: transferDetails.usdToTransfer * 0.025
			}
		)

		await addExclusiveVideoAccessPurchase(
			exclusiveVideoData.video_id,
			solanaWallet.user_id,
			Number(tierNumber),
			solTransferId,
			fortunaTakeId
		)

		const isTierSoldOut = await updateCheckIfVideoAccessTierSoldOut(exclusiveVideoData, Number(tierNumber))
		let isVideoSoldOut = false
		if (isTierSoldOut === true && _.isEqual(Number(tierNumber), exclusiveVideoData.total_number_video_tiers)) {
			await setNewVideoListingStatus(exclusiveVideoData.video_id, "SOLDOUT")
			isVideoSoldOut = true
		}
		const videoUrl = await VideoUrlsManager.getInstance().getVideoUrl(exclusiveVideoData.uuid)

		return res.status(200).json({ videoUrl, isTierSoldOut, isVideoSoldOut })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to purchase exclusive content" })
	}
}
