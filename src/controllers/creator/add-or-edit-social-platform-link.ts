import { Request, Response } from "express"
import { SocialPlatforms } from "@prisma/client"
import upsertSocialPlatformLink from "../../db-operations/write/social-platform-link/upsert-social-platform-link"

export default async function addOrEditSocialPlatformLink (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const { socialLink } = req.body
		const socialPlatform = req.body.socialPlatform as SocialPlatforms

		await upsertSocialPlatformLink(user.user_id, socialLink, socialPlatform)

		return res.status(200).json({ success: "Added or Edited Social Platform Link" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to add or update social platform link" })
	}
}
