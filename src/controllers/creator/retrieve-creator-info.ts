import { Request, Response } from "express"
import retrieveChannelName from "../../db-operations/read/channel-name/retrieve-channel-name"

export default async function retrieveCreatorInfo(req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const channelName = await retrieveChannelName(user.user_id)

		return res.status(200).json({ channelName })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve creator info" })
	}
}
