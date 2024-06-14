import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import retrieveVideoDataForExclusiveContentCheckByUUID
	from "../../../db-operations/read/video/retrieve-video-data-for-exclusive-content-check-by-uuid"

export default async function attachMinimalExclusiveVideoDataByUUID(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { videoUUID } = req.body
		const minimalDataNeededToCheckForExclusiveContentAccess = await retrieveVideoDataForExclusiveContentCheckByUUID(videoUUID)
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
