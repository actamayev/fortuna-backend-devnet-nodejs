import _ from "lodash"
import { Request, Response } from "express"
import SecretsManager from "../../classes/secrets-manager"
import signJWT from "../../utils/auth-helpers/jwt/sign-jwt"
import createSolanaWallet from "../../utils/solana/create-solana-wallet"
import createGoogleAuthClient from "../../utils/google/create-google-auth-client"
import retrieveUserByEmail from "../../utils/db-operations/read/credentials/retrieve-user-by-email"
import addLoginHistoryRecord from "../../utils/db-operations/write/login-history/add-login-history-record"
import addGoogleUserWithWallet from "../../utils/db-operations/write/simultaneous-writes/add-google-user-with-wallet"

export default async function googleLoginAuthCallback (req: Request, res: Response): Promise<Response> {
	try {
		const { idToken } = req.body
		const client = await createGoogleAuthClient()
		const googleClientId = await SecretsManager.getInstance().getSecret("GOOGLE_CLIENT_ID")
		const ticket = await client.verifyIdToken({
			idToken,
			audience: googleClientId
		})
		const payload = ticket.getPayload()
		if (_.isUndefined(payload)) return res.status(500).json({ error: "Unable to get payload" })
		if (_.isUndefined(payload.email)) return res.status(500).json({ error: "Unable to find user email from payload" })

		const googleUser = await retrieveUserByEmail(payload.email)
		let userId = googleUser?.user_id
		let accessToken: string
		let isNewUser = false
		if (_.isUndefined(userId)) {
			const walletKeypair = await createSolanaWallet()
			userId = await addGoogleUserWithWallet(payload.email, walletKeypair)
			accessToken = await signJWT({ userId, newUser: true })
			isNewUser = true
		} else {
			accessToken = await signJWT({ userId, newUser: false })
		}

		await addLoginHistoryRecord(userId)

		return res.status(200).json({ accessToken, isNewUser })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Login with Google" })
	}
}
