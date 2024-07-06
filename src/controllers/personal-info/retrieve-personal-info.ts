import { Request, Response } from "express"
import Encryptor from "../../classes/encryptor"
import retrieveProfilePictureUrlByUserId from "../../db-operations/read/credentials/retrieve-profile-picture-url-by-user-id"

export default async function retrievePersonalInfo(req: Request, res: Response): Promise<Response> {
	try {
		const { user, solanaWallet } = req
		const profilePictureUrl = await retrieveProfilePictureUrlByUserId(user.user_id)

		const encryptor = new Encryptor()
		const email = await encryptor.deterministicDecrypt(user.email__encrypted, "EMAIL_ENCRYPTION_KEY")

		return res.status(200).json({
			username: user.username,
			email,
			defaultCurrency: user.default_currency,
			defaultSiteTheme: user.default_site_theme,
			profilePictureUrl,
			publicKey: solanaWallet.public_key
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve personal info" })
	}
}
