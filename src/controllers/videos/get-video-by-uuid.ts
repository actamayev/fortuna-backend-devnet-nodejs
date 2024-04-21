import _ from "lodash"
import { Response, Request } from "express"
import transformVideoAndImageData from "../../utils/transform/transform-video-and-image-data"
import retrieveVideoByUUID from "../../utils/db-operations/read/uploaded-video/retrieve-video-by-uuid"
import retrieveImageUrlByUUID from "../../utils/db-operations/read/uploaded-image/retrieve-image-url-by-uuid"
import determineNumberOfTokensRemainingInEscrow from "../../utils/solana/determine-number-of-remaining-tokens-in-escrow"

export default async function getVideoByUUID (req: Request, res: Response): Promise<Response> {
	try {
		const videoUUID = req.params.videoUUID as string

		// TOOD: See if there's a way to combine retrieveVideoByUUID and retrieveImageUrlByUUID into one prisma command
		const videoData = await retrieveVideoByUUID(videoUUID)
		if (_.isNull(videoData)) return res.status(500).json({ error: "Unable to find video for the provided UUID" })

		const imageUrl = await retrieveImageUrlByUUID(videoUUID)
		if (_.isNull(imageUrl)) return res.status(500).json({ error: "Unable to find the video thumbnail/image" })
		const remainingSharesForSale = await determineNumberOfTokensRemainingInEscrow(videoData.spl.public_key_address)

		const transformedVideoData = transformVideoAndImageData(videoData, imageUrl, remainingSharesForSale)

		return res.status(200).json({ videoData: transformedVideoData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get video by UUID" })
	}
}
