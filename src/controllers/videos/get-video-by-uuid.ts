import _ from "lodash"
import { Response, Request } from "express"
import EscrowWalletManager from "../../classes/escrow-wallet-manager"
import transformVideoAndImageData from "../../utils/transform/transform-video-and-image-data"
import retrieveVideoByUUID from "../../utils/db-operations/read/uploaded-video/retrieve-video-by-uuid"

export default async function getVideoByUUID (req: Request, res: Response): Promise<Response> {
	try {
		const { videoUUID } = req.params

		const videoData = await retrieveVideoByUUID(videoUUID)
		if (_.isNull(videoData)) return res.status(500).json({ error: "Unable to find video for the provided UUID" })

		const remainingSharesForSale = await EscrowWalletManager.getInstance().retrieveTokenAmountByPublicKey(
			videoData.spl.public_key_address
		)

		const transformedVideoData = transformVideoAndImageData(videoData, remainingSharesForSale)

		return res.status(200).json({ videoData: transformedVideoData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get video by UUID" })
	}
}
