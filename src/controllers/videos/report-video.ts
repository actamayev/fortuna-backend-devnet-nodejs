import { Request, Response } from "express"
import addReportVideoRecord from "../../db-operations/write/report-video/add-report-video-record"

export default async function reportVideo(req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const { videoId, reportMessage } = req.body as { videoId: number, reportMessage?: string }

		await addReportVideoRecord(user.user_id, videoId, reportMessage)

		return res.status(200).json({ success: "Video reported" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to report video" })
	}
}
