import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import retrieveVideoIdByUUIDAndUserId from "../../db-operations/read/video/retrieve-video-id-by-uuid-and-user-id"

export default async function attachVideoByUUID(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { user } = req
		const { videoUUID } = req.body
		const basicVideoDetails = await retrieveVideoIdByUUIDAndUserId(videoUUID, user.user_id)
		if (_.isNull(basicVideoDetails)) return res.status(400).json({ message: "Cannot find video" })

		req.basicVideoDetails = basicVideoDetails
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Basic Video Data" })
	}
}
