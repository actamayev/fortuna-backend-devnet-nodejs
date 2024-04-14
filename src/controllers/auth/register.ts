import { Response, Request } from "express"
import Hash from "../../classes/hash"
import signJWT from "../../utils/auth-helpers/jwt/sign-jwt"
import createSolanaWallet from "../../utils/solana/create-solana-wallet"
import { addLocalUser } from "../../utils/auth-helpers/register/add-local-user"
import createUserWithWallet from "../../utils/db-operations/write/add-user-with-wallet"
import determineContactType from "../../utils/auth-helpers/login/determine-contact-type"
import doesContactExist from "../../utils/db-operations/read/does-x-exist/does-contact-exist"
import doesUsernameExist from "../../utils/db-operations/read/does-x-exist/does-username-exist"
import addLoginHistoryRecord from "../../utils/db-operations/write/login-history/add-login-history-record"

export default async function register (req: Request, res: Response): Promise<Response> {
	try {
		const registerInformation = req.body.registerInformation as RegisterInformation
		const contactType = determineContactType(registerInformation.contact)

		if (contactType === "Username") return res.status(400).json({ message: "Please enter a valid Email or Phone Number" })

		const contactExists = await doesContactExist(registerInformation.contact, contactType)
		if (contactExists === true) return res.status(400).json({ message: `${contactType} already exists` })

		const usernameExists = await doesUsernameExist(registerInformation.username)
		if (usernameExists === true) return res.status(400).json({ message: "Username taken" })

		const hashedPassword = await Hash.hashCredentials(registerInformation.password)

		const userData = addLocalUser(registerInformation, hashedPassword, contactType)
		const walletInformation = await createSolanaWallet()
		const { userId, publicKey } = await createUserWithWallet(userData, walletInformation)

		await addLoginHistoryRecord(userId)

		const accessToken = signJWT({ userId, newUser: true })

		return res.status(200).json({ accessToken, publicKey: publicKey })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Register New User" })
	}
}
