import _ from "lodash"
import { Response, Request } from "express"
import Hash from "../../classes/hash"
import signJWT from "../../utils/auth-helpers/jwt/sign-jwt"
import determineLoginContactType from "../../utils/auth-helpers/determine-contact-type"
import { findSolanaWalletByUserId } from "../../db-operations/read/find/find-solana-wallet"
import retrieveUserFromContact from "../../utils/auth-helpers/login/retrieve-user-from-contact"
import addLoginHistoryRecord from "../../db-operations/write/login-history/add-login-history-record"

export default async function login (req: Request, res: Response): Promise<Response> {
	try {
		const { contact, password } = req.body.loginInformation as LoginInformation
		const loginContactType = determineLoginContactType(contact)

		const credentialsResult = await retrieveUserFromContact(contact, loginContactType)
		if (_.isNull(credentialsResult)) return res.status(400).json({ message: `${loginContactType} not found!` })
		if (credentialsResult.auth_method === "google") {
			return res.status(400).json({ message: "Please log in via Google" })
		}

		const doPasswordsMatch = await Hash.checkPassword(password, credentialsResult.password as HashedString)
		if (doPasswordsMatch === false) return res.status(400).json({ message: "Wrong Username or Password!" })

		const accessToken = await signJWT({ userId: credentialsResult.user_id, newUser: false })

		await addLoginHistoryRecord(credentialsResult.user_id)

		const solanaWallet = await findSolanaWalletByUserId(credentialsResult.user_id)
		if (_.isNull(solanaWallet)) return res.status(400).json({ message: "Unable to find user's Solana wallet" })

		return res.status(200).json({ accessToken, publicKey: solanaWallet.public_key })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Login" })
	}
}
