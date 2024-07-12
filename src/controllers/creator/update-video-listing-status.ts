import { Request, Response } from "express"
import { VideoListingStatus } from "@prisma/client"
import setNewVideoListingStatus from "../../db-operations/write/video/set-new-video-listing-status"

export default async function updateVideoListingStatus(req: Request, res: Response): Promise<Response> {
	try {
		const { nonExclusiveVideoData } = req

		// Can only update non-exclusive videos, therefore it can never be soldout
		if (nonExclusiveVideoData.video_listing_status === "SOLDOUT") {
			return res.status(500).json({ error: "Unable to update status of a soldout video"  })
		}

		let newVideoListingStatus: VideoListingStatus
		if (nonExclusiveVideoData.video_listing_status === "LISTED") {
			newVideoListingStatus = "UNLISTED"
		} else {
			newVideoListingStatus = "LISTED"
		}

		await setNewVideoListingStatus(nonExclusiveVideoData.video_id, newVideoListingStatus)

		return res.status(200).json({ success: "Updated video listing status" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to update video listing status" })
	}
}
