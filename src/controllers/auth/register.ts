import { Response, Request } from "express"
import Hash from "../../classes/hash"
import signJWT from "../../utils/auth-helpers/jwt/sign-jwt"
import { addLocalUser } from "../../utils/auth-helpers/register/add-local-user"
import createDevnetSolanaWallet from "../../utils/solana/create-devnet-solana-wallet"
import determineContactType from "../../utils/auth-helpers/login/determine-contact-type"
import doesContactExist from "../../utils/db-operations/read/does-x-exist/does-contact-exist"
import doesUsernameExist from "../../utils/db-operations/read/does-x-exist/does-username-exist"
import addLoginHistoryRecord from "../../utils/db-operations/write/login-history/add-login-history-record"

// eslint-disable-next-line complexity
export default async function register (req: Request, res: Response): Promise<Response> {
	try {
		const { contact, username, password } = req.body.registerInformation as RegisterInformation
		const contactType = determineContactType(contact)

		if (contactType === "Username") return res.status(400).json({ message: "Please enter a valid Email or Phone Number" })

		const contactExists = await doesContactExist(contact, contactType)
		if (contactExists === true) return res.status(400).json({ message: `${contactType} already exists` })

		const usernameExists = await doesUsernameExist(username)
		if (usernameExists === true) return res.status(400).json({ message: "Username taken" })

		const hashedPassword = await Hash.hashCredentials(password)

		const userId = await addLocalUser(req.body.registerInformation, hashedPassword, contactType)

		const accessToken = signJWT({ userId, newUser: true })

		const walletInformation = await createDevnetSolanaWallet(userId)

		await addLoginHistoryRecord(userId)

		return res.status(200).json({ accessToken, publicKey: walletInformation.publicKey })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Register New User" })
	}
}
