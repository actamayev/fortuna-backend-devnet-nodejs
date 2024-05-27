import _ from "lodash"
import { Response, Request } from "express"
import VideoUrlsManager from "../../classes/video-urls-manager"
import EscrowWalletManager from "../../classes/escrow-wallet-manager"
import transformVideoAndImageData from "../../utils/transform/transform-video-and-image-data"
import retrieveVideoByUUID from "../../db-operations/read/uploaded-video/retrieve-video-by-uuid"
import checkIfUserAllowedToAccessContent from "../../utils/exclusive-content/check-if-user-allowed-to-access-content"

export default async function getVideoByUUID (req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet as ExtendedSolanaWallet | undefined
		const { videoUUID } = req.params

		const videoData = await retrieveVideoByUUID(videoUUID)
		if (_.isNull(videoData)) return res.status(500).json({ error: "Unable to find video for the provided UUID" })

		let remainingSharesForSale = 0
		if (videoData.spl.spl_listing_status !== "SOLDOUT") {
			remainingSharesForSale = await EscrowWalletManager.getInstance().retrieveTokenAmountByPublicKey(
				videoData.spl.public_key_address
			)
		}

		if (videoData.spl.is_spl_exclusive === false) {
			const videoUrl = await VideoUrlsManager.getInstance().getVideoUrl(videoData.uuid)
			videoData.videoUrl = videoUrl
		} else if (!_.isUndefined(solanaWallet)) {
			const isUserAbleToAccessVideo = await checkIfUserAllowedToAccessContent(solanaWallet.solana_wallet_id, videoData.spl)
			if (isUserAbleToAccessVideo === true) {
				const videoUrl = await VideoUrlsManager.getInstance().getVideoUrl(videoData.uuid)
				videoData.videoUrl = videoUrl
			}
		}

		const transformedVideoData = transformVideoAndImageData(videoData, remainingSharesForSale)

		return res.status(200).json({ videoData: transformedVideoData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get video by UUID" })
	}
}
