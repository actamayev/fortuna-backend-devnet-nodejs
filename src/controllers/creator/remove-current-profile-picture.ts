import { Request, Response } from "express"
import markProfilePictureLinkInactive from "../../db-operations/write/credentials/mark-profile-picture-inactive"

export default async function removeCurrentProfilePicture (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req

		await markProfilePictureLinkInactive(user.user_id)

		return res.status(200).json({ success: "Removed Profile picture" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to remove profile picture" })
	}
}
