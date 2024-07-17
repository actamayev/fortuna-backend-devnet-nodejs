import { Request, Response } from "express"
import transformCreatorInfo from "../../utils/transform/transform-creator-info"
import retrieveCreatorDetails from "../../db-operations/read/credentials/retrieve-creator-details"

export default async function getCreatorInfo(req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const creatorDetails = await retrieveCreatorDetails(user.user_id)

		const transformedCreatorInfo = transformCreatorInfo(creatorDetails)

		return res.status(200).json({ ...transformedCreatorInfo })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve creator info" })
	}
}
