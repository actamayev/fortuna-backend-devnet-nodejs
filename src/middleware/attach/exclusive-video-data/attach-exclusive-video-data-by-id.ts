import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import retrieveExclusiveVideoDataById from "../../../db-operations/read/video/retrieve-exclusive-video-data-by-id"

export default async function attachExclusiveVideoDataById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { videoId, tierNumber } = req.body
		const exclusiveVideoData = await retrieveExclusiveVideoDataById(videoId, tierNumber)
		if (_.isNull(exclusiveVideoData)) return res.status(400).json({ message: "Cannot find Exclusive Video" })

		req.exclusiveVideoData = exclusiveVideoData
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Exclusive Video Data" })
	}
}
