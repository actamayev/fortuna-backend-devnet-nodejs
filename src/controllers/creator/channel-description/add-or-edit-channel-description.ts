import { Request, Response } from "express"
import upsertChannelDescription from "../../../db-operations/write/channel-description/upsert-channel-description"

export default async function addOrEditChannelDescription (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const { channelDescription } = req.body

		await upsertChannelDescription(user.user_id, channelDescription)

		return res.status(200).json({ success: "Added or Edited Channel Description" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Add or Edit Channel Description" })
	}
}
