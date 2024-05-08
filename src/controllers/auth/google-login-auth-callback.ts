import _ from "lodash"
import bs58 from "bs58"
import { Request, Response } from "express"
import Encryptor from "../../classes/encryptor"
import SecretsManager from "../../classes/secrets-manager"
import signJWT from "../../utils/auth-helpers/jwt/sign-jwt"
import createSolanaWallet from "../../utils/solana/create-solana-wallet"
import createGoogleAuthClient from "../../utils/google/create-google-auth-client"
import retrieveUserByEmail from "../../db-operations/read/credentials/retrieve-user-by-email"
import addLoginHistoryRecord from "../../db-operations/write/login-history/add-login-history-record"
import addGoogleUserWithWallet from "../../db-operations/write/simultaneous-writes/add-google-user-with-wallet"

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

		const encryptor = new Encryptor()
		const encryptedEmail = await encryptor.deterministicEncrypt(payload.email, "EMAIL_ENCRYPTION_KEY")
		const googleUserId = await retrieveUserByEmail(encryptedEmail)
		let userId = googleUserId
		let accessToken: string
		let isNewUser = false
		if (!_.isNull(userId)) {
			accessToken = await signJWT({ userId, newUser: false })
		} else {
			const walletKeypair = await createSolanaWallet()
			const encryptedSecretKey = await encryptor.nonDeterministicEncrypt(bs58.encode(
				Buffer.from(walletKeypair.secretKey)
			), "SECRET_KEY_ENCRYPTION_KEY")
			userId = await addGoogleUserWithWallet(encryptedEmail, walletKeypair.publicKey, encryptedSecretKey)
			accessToken = await signJWT({ userId, newUser: true })
			isNewUser = true
		}

		await addLoginHistoryRecord(userId)

		return res.status(200).json({ accessToken, isNewUser })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Login with Google" })
	}
}
