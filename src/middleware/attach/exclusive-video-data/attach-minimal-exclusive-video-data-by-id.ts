import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import {retrieveVideoDataForExclusiveContentCheckById }
	from "../../../db-operations/read/video/retrieve-video-data-for-exclusive-content-check"

export default async function attachMinimalExclusiveVideoDataById(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { videoId } = req.body
		const minimalDataNeededToCheckForExclusiveContentAccess = await retrieveVideoDataForExclusiveContentCheckById(videoId)
		if (_.isNull(minimalDataNeededToCheckForExclusiveContentAccess)) {
			return res.status(400).json({ message: "Cannot find Exclusive Video" })
		}

		req.minimalDataNeededToCheckForExclusiveContentAccess = minimalDataNeededToCheckForExclusiveContentAccess
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Exclusive Video Data" })
	}
}
