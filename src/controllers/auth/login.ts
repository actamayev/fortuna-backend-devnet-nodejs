import _ from "lodash"
import { Response, Request } from "express"
import Hash from "../../classes/hash"
import addLoginRecord from "../../utils/auth-helpers/add-login-record"
import retrieveUserFromContact from "../../utils/auth-helpers/login/retrieve-user-from-contact"
import determineLoginType from "../../utils/auth-helpers/login/determine-login-type"
import createAndSignJWT from "../../utils/auth-helpers/jwt/create-and-sign-jwt"

export default async function login (req: Request, res: Response): Promise<Response> {
	try {
		const { contact, password } = req.body.loginInformationObject as LoginInformationObject
		const contactType = determineLoginType(contact)

		const user = await retrieveUserFromContact(contact, contactType)
		if (_.isNull(user)) return res.status(400).json({ message: `${contactType} not found!` })

		const doPasswordsMatch = await Hash.checkPassword(password, user.password)
		if (doPasswordsMatch === false) return res.status(400).json({ message: "Wrong Username or Password!" })

		const accessToken = createAndSignJWT(user._id)
		if (_.isUndefined(accessToken)) return res.status(500).json({ error: "Internal Server Error: Unable to Sign JWT" })

		await addLoginRecord(user._id)

		return res.status(200).json({
			userId: user._id,
			accessToken,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Login" })
	}
}
