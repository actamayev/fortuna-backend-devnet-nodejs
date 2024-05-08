import { Request, Response } from "express"
import Encryptor from "../../classes/encryptor"

export default async function decryptNonDeterministicString(req: Request, res: Response): Promise<Response> {
	try {
		const string = req.body.stringToDecrypt as NonDeterministicEncryptedString
		const encryptionKeyName = req.body.encryptionKeyName as NonDeterministicEncryptionKeys

		const encryptor = new Encryptor()

		const decryptedString = await encryptor.nonDeterministicDecrypt(string, encryptionKeyName)
		return res.status(200).json({ decryptedString })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Decrypt string" })
	}
}
