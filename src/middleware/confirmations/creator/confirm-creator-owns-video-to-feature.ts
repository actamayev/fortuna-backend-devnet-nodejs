import { Request, Response, NextFunction } from "express"
import checkIfCreatorOwnsFeaturedAndUnfeaturedVideos
	from "../../../db-operations/read/video/check-if-creator-owns-featured-and-unfeatured-videos"

export default async function confirmCreatorOwnsVideoToFeature(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { user } = req
		const { videoIdToFeature, videoIdToUnfeature } = req.body as { videoIdToFeature: number, videoIdToUnfeature?: number }

		const creatorOwnsFeaturedAndUnfeaturedVideos = await checkIfCreatorOwnsFeaturedAndUnfeaturedVideos(
			videoIdToFeature,
			user.user_id,
			videoIdToUnfeature
		)

		if (creatorOwnsFeaturedAndUnfeaturedVideos === false) {
			return res.status(500).json({
				error: "Creator does not own the video they are trying to feature, or the previously featured video"
			})
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			error: "Internal Server Error: Unable to confirm that creator owns the video they want to feature"
		})
	}
}
