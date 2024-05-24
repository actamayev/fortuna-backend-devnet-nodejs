import _ from "lodash"
import { Response, Request } from "express"
import AwsS3 from "../../classes/aws-s3"
import EscrowWalletManager from "../../classes/escrow-wallet-manager"
import transformVideoAndImageData from "../../utils/transform/transform-video-and-image-data"
import retrieveVideoByUUID from "../../db-operations/read/uploaded-video/retrieve-video-by-uuid"
import checkIfUserAllowedToAccessContent from "../../utils/exclusive-content/check-if-user-allowed-to-access-content"

export default async function getVideoByUUID (req: Request, res: Response): Promise<Response> {
	try {
		const { videoUUID } = req.params

		const videoData = await retrieveVideoByUUID(videoUUID)
		if (_.isNull(videoData)) return res.status(500).json({ error: "Unable to find video for the provided UUID" })

		let remainingSharesForSale = 0
		if (videoData.spl.spl_listing_status !== "SOLDOUT") {
			remainingSharesForSale = await EscrowWalletManager.getInstance().retrieveTokenAmountByPublicKey(
				videoData.spl.public_key_address
			)
		}

		if (!_.isUndefined(req.solanaWallet)) {
			const isUserAbleToAccessVideo = await checkIfUserAllowedToAccessContent(req.solanaWallet.solana_wallet_id, videoData.spl)
			if (isUserAbleToAccessVideo === true) {
				const videoUrl = await AwsS3.getInstance().getSignedVideoUrl(videoData.uuid)
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
