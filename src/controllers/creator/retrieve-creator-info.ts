import { Request, Response } from "express"
import retrieveCreatorDetails from "../../db-operations/read/credentials/retrieve-creator-details"

export default async function retrieveCreatorInfo(req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const creatorDetails = await retrieveCreatorDetails(user.user_id)

		return res.status(200).json({
			channelName: creatorDetails?.channel_name?.channel_name || null,
			channelDescription: creatorDetails?.channel_description?.channel_description || null
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve creator info" })
	}
}
