import { Response, Request } from "express"
import Hash from "../../classes/hash"
import signJWT from "../../utils/auth-helpers/jwt/sign-jwt"
import addLoginHistoryRecord from "../../utils/db-operations/auth/add-login-history-record"
import { addLocalUser } from "../../utils/auth-helpers/register/add-local-user"
import doesContactExist from "../../utils/auth-helpers/does-x-exist/does-contact-exist"
import determineContactType from "../../utils/auth-helpers/login/determine-contact-type"
import doesUsernameExist from "../../utils/auth-helpers/does-x-exist/does-username-exist"

export default async function register (req: Request, res: Response): Promise<Response> {
	try {
		const { contact, username, password } = req.body.registerInformation as RegisterInformation
		const contactType = determineContactType(contact)

		if (contactType === "Username") return res.status(400).json({ message: "Please enter a valid Email or Phone Bumber" })

		const contactExists = await doesContactExist(contact, contactType)
		if (contactExists === true) return res.status(400).json({ message: `${contactType} already exists` })

		const usernameExists = await doesUsernameExist(username)
		if (usernameExists === true) return res.status(400).json({ message: "Username taken" })

		const hashedPassword = await Hash.hashCredentials(password)

		const userId = await addLocalUser(req.body.registerInformation, hashedPassword, contactType)
		if (userId === undefined) return res.status(500).json({ error: "Internal Server Error: Unable to Create User" })

		const accessToken = signJWT({ userId, newUser: true })
		if (accessToken === undefined) return res.status(500).json({ error: "Internal Server Error: Unable to Sign JWT" })

		await addLoginHistoryRecord(userId)

		return res.status(200).json({ accessToken })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Register New User" })
	}
}
