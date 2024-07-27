import { Request, Response } from "express"
import { SocialPlatforms } from "@prisma/client"
import markSocialPlatformLinkInactive from "../../../db-operations/write/social-platform-link/mark-social-platform-link-inactive"

export default async function removeSocialPlatformLink (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const socialPlatform = req.params.socialPlatform as SocialPlatforms

		await markSocialPlatformLinkInactive(user.user_id, socialPlatform)

		return res.status(200).json({ success: "Removed Social Platform Link" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to remove social platform link" })
	}
}
