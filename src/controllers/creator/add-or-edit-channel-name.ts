import { Request, Response } from "express"
import upsertChannelName from "../../db-operations/write/channel-name/upsert-channel-name"

export default async function addOrEditChannelName (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const { channelName } = req.body

		await upsertChannelName(user.user_id, channelName)

		return res.status(200).json({ success: "Added or Edited Channel name" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Add or Edit Channel Name" })
	}
}
