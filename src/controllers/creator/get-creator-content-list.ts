import { Request, Response } from "express"
import retrieveCreatorContentList from "../../db-operations/read/video/retrieve-creator-content-list"
import transformCreatorContentList from "../../utils/transform/creator/transform-creator-content-list"

export default async function getCreatorContentList(req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req

		const creatorVideoData = await retrieveCreatorContentList(user.user_id)

		const creatorContentList = transformCreatorContentList(creatorVideoData)

		return res.status(200).json({ creatorContentList })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Creator content list" })
	}
}
