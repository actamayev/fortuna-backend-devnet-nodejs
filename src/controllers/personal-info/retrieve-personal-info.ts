import _ from "lodash"
import { Request, Response } from "express"
import Encryptor from "../../classes/encryptor"
import retrieveProfilePictureUrlByUserId from "../../db-operations/read/profile-picture/retrieve-profile-picture-url-by-user-id"

export default async function retrievePersonalInfo(req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const profilePictureUrl = await retrieveProfilePictureUrlByUserId(user.user_id)

		const encryptor = new Encryptor()
		let decryptedEmail: string | null = null
		if (!_.isNull(user.email__encrypted)) {
			decryptedEmail = await encryptor.decrypt(user.email__encrypted, "EMAIL_ENCRYPTION_KEY")
		}
		let decryptedPhoneNumber: string | null = null
		if (!_.isNull(user.phone_number__encrypted)) {
			decryptedPhoneNumber = await encryptor.decrypt(user.phone_number__encrypted, "PHONE_NUMBER_ENCRYPTION_KEY")
		}

		return res.status(200).json({
			username: user.username,
			email: decryptedEmail,
			phoneNumber: decryptedPhoneNumber,
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
