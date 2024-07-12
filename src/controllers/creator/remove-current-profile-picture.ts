import { Request, Response } from "express"
import markProfilePictureInactive from "../../db-operations/write/profile-picture/mark-profile-picture-inactive"

export default async function removeCurrentProfilePicture (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req

		await markProfilePictureInactive(user.user_id)

		return res.status(200).json({ success: "Removed Profile picture" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to remove profile picture" })
	}
}
