import _ from "lodash"
import { Response, Request } from "express"
import transformVideosByCreatorUsername from "../../utils/transform/transform-videos-by-creator-username"
import retrieveVideosByCreatorUsername from "../../utils/db-operations/read/credentials/retrieve-videos-by-creator-username"

export default async function getVideosByCreatorUsername (req: Request, res: Response): Promise<Response> {
	try {
		const { creatorUsername } = req.params

		const retrievedVideoData = await retrieveVideosByCreatorUsername(creatorUsername)
		if (_.isNull(retrievedVideoData)) return res.status(400).json({ message: "Unable to find creator associated with this username" })

		const transformedVideoData = await transformVideosByCreatorUsername(retrievedVideoData)
		if (_.isNull(transformedVideoData)) return res.status(400).json({ message: "Unable to find creator associated with this username"})

		return res.status(200).json({
			videoData: transformedVideoData.videoData,
			creatorData: transformedVideoData.creatorData
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get videos by creator username" })
	}
}
