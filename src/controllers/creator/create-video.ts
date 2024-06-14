import { Request, Response } from "express"
import addVideoRecord from "../../db-operations/write/video/add-video-record"

export default async function createVideo (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const newVideoData = req.body.newVideoData as IncomingNewVideoData

		const newVideoId = await addVideoRecord(newVideoData, user.user_id)

		return res.status(200).json({ newVideoId })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Video" })
	}
}
