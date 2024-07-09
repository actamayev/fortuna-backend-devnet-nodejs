import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import retrieveBasicVideoDetailsByUUID from "../../db-operations/read/video/retrieve-basic-video-details-by-uuid"

export default async function attachVideoByUUID(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { videoUUID } = req.body
		const basicVideoDetails = await retrieveBasicVideoDetailsByUUID(videoUUID)
		if (_.isNull(basicVideoDetails)) return res.status(400).json({ message: "Cannot find video" })

		req.basicVideoDetails = basicVideoDetails
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Basic Video Data" })
	}
}
