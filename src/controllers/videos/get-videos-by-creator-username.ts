import _ from "lodash"
import { Response, Request } from "express"
import transformVideosByCreatorUsername from "../../utils/transform/videos/transform-videos-by-creator-username"
import retrieveVideosByCreatorUsername from "../../db-operations/read/credentials/retrieve-videos-by-creator-username"
import retrieveCreatorDetailsByCreatorUsername from "../../db-operations/read/credentials/retrieve-creator-details-by-creator-username"

export default async function getVideosByCreatorUsername (req: Request, res: Response): Promise<Response> {
	try {
		const { optionallyAttachedUser } = req
		const creatorUsername = req.params.creatorUsername as string

		const retrievedVideoData = await retrieveVideosByCreatorUsername(creatorUsername)
		if (_.isNull(retrievedVideoData)) return res.status(400).json({ message: "Unable to find creator associated with this username" })

		const creatorDetails = await retrieveCreatorDetailsByCreatorUsername(creatorUsername)

		const transformedVideoData = await transformVideosByCreatorUsername(retrievedVideoData, optionallyAttachedUser, creatorDetails)
		if (_.isNull(transformedVideoData)) return res.status(400).json({ message: "Unable to find creator associated with this username"})

		return res.status(200).json({ ... transformedVideoData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get videos by creator username" })
	}
}
