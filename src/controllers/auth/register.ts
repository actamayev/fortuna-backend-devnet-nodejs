import bs58 from "bs58"
import { Response, Request } from "express"
import Hash from "../../classes/hash"
import Encryptor from "../../classes/encryptor"
import signJWT from "../../utils/auth-helpers/jwt/sign-jwt"
import createSolanaWallet from "../../utils/solana/create-solana-wallet"
import addLocalUser from "../../utils/auth-helpers/register/add-local-user"
import doesContactExist from "../../db-operations/read/does-x-exist/does-email-exist"
import doesUsernameExist from "../../db-operations/read/does-x-exist/does-username-exist"
import addUserWithWallet from "../../db-operations/write/simultaneous-writes/add-user-with-wallet"
import addLoginHistoryRecord from "../../db-operations/write/login-history/add-login-history-record"

export default async function register (req: Request, res: Response): Promise<Response> {
	try {
		const registerInformation = req.body.registerInformation as RegisterInformation

		const encryptor = new Encryptor()
		const encryptedContact = await encryptor.deterministicEncrypt(registerInformation.email, "EMAIL_ENCRYPTION_KEY")
		const contactExists = await doesContactExist(encryptedContact)
		if (contactExists === true) return res.status(400).json({ message: "Email already exists" })

		const usernameExists = await doesUsernameExist(registerInformation.username)
		if (usernameExists === true) return res.status(400).json({ message: "Username taken" })

		const hashedPassword = await Hash.hashCredentials(registerInformation.password)

		const userData = await addLocalUser(registerInformation, hashedPassword)
		const walletKeypair = await createSolanaWallet()

		const encryptedSecretKey = await encryptor.nonDeterministicEncrypt(bs58.encode(
			Buffer.from(walletKeypair.secretKey)
		), "SECRET_KEY_ENCRYPTION_KEY")

		const userId = await addUserWithWallet(userData, walletKeypair.publicKey, encryptedSecretKey)

		await addLoginHistoryRecord(userId)

		const accessToken = await signJWT({ userId, newUser: true })

		return res.status(200).json({ accessToken, publicKey: walletKeypair.publicKey.toString() })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Register New User" })
	}
}
