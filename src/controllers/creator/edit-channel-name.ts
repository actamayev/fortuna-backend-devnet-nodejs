import { Request, Response } from "express"
import updateChannelName from "../../db-operations/write/channel-name/upsert-channel-name"

export default async function editChannelName (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const { channelName } = req.body

		await updateChannelName(user.user_id, channelName)

		return res.status(200).json({ success: "Edited Channel name" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Edit Channel Name" })
	}
}
