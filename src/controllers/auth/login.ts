import _ from "lodash"
import { Response, Request } from "express"
import Hash from "../../classes/hash"
import signJWT from "../../utils/auth-helpers/jwt/sign-jwt"
import determineContactType from "../../utils/auth-helpers/login/determine-contact-type"
import retrieveUserFromContact from "../../utils/auth-helpers/login/retrieve-user-from-contact"
import addLoginHistoryRecord from "../../utils/db-operations/write/login-history/add-login-history-record"

export default async function login (req: Request, res: Response): Promise<Response> {
	try {
		const { contact, password } = req.body.loginInformation as LoginInformation
		const contactType = determineContactType(contact)

		const credentialsResult = await retrieveUserFromContact(contact, contactType)
		if (_.isNull(credentialsResult)) {
			return res.status(400).json({ message: `${contactType} not found!` })
		}

		const doPasswordsMatch = await Hash.checkPassword(password, credentialsResult.password)
		if (doPasswordsMatch === false) return res.status(400).json({ message: "Wrong Username or Password!" })

		const accessToken = signJWT({ userId: credentialsResult.user_id, newUser: false })

		await addLoginHistoryRecord(credentialsResult.user_id)

		return res.status(200).json({ accessToken })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Login" })
	}
}
