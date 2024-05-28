import _ from "lodash"
import { NextFunction, Request, Response } from "express"
import retrieveExclusiveVideoDataByUUID from "../../db-operations/read/spl/retrieve-exclusive-video-data-by-uuid"

export default async function attachExclusiveVideoData(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { videoUUID } = req.params
		const exclusiveVideoData = await retrieveExclusiveVideoDataByUUID(videoUUID)
		if (_.isNull(exclusiveVideoData)) return res.status(400).json({ message: "Cannot find Exclusive Video" })

		if (
			_.isNull(exclusiveVideoData.is_content_instantly_accessible) ||
			_.isNull(exclusiveVideoData.instant_access_price_to_exclusive_content_usd)
		) {
			return res.status(400).json({ message: "This SPL doesn't have exclusive instant access" })
		}

		req.exclusiveVideoData = exclusiveVideoData as InstantAccessExclusiveVideoData
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach Exclusive Video Data" })
	}
}
