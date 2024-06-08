import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import retrieveExclusiveVideoDataByUUID from "../../db-operations/read/video/retrieve-exclusive-video-data-by-uuid"

export default async function attachExclusiveVideoData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { videoUUID, tierNumber } = req.body
		const exclusiveVideoData = await retrieveExclusiveVideoDataByUUID(videoUUID, tierNumber)
		if (_.isNull(exclusiveVideoData)) return res.status(400).json({ message: "Cannot find Exclusive Video" })

		req.exclusiveVideoData = exclusiveVideoData
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Exclusive Video Data" })
	}
}
