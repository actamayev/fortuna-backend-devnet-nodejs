import { Request, Response } from "express"
import retrieveProfilePictureUrlByUserId from "../../db-operations/read/profile-picture/retrieve-profile-picture-url-by-user-id"

export default async function retrievePersonalInfo(req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const profilePictureUrl = await retrieveProfilePictureUrlByUserId(user.user_id)

		return res.status(200).json({
			username: user.username,
			defaultCurrency: user.default_currency,
			defaultSiteTheme: user.default_site_theme,
			isApprovedToBeCreator: user.is_approved_to_be_creator,
			profilePictureUrl
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve personal info" })
	}
}
