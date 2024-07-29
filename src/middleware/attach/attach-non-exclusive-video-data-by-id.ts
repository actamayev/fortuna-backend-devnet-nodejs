import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import retrieveNonExclusiveVideoByUUID from "../../db-operations/read/video/retrieve-non-exclusive-video-by-uuid"

export default async function attachNonExclusiveVideoDataById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { videoId } = req.params
		const { user } = req
		const nonExclusiveVideoData = await retrieveNonExclusiveVideoByUUID(Number(videoId), user.user_id)
		if (_.isNull(nonExclusiveVideoData)) return res.status(400).json({ message: "Cannot find Video" })

		req.nonExclusiveVideoData = nonExclusiveVideoData
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Video Data" })
	}
}
