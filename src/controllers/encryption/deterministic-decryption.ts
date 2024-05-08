import { Request, Response } from "express"
import Encryptor from "../../classes/encryptor"

export default async function decryptDeterministicString(req: Request, res: Response): Promise<Response> {
	try {
		const string = req.body.stringToDecrypt as DeterministicEncryptedString
		const encryptionKeyName = req.body.encryptionKeyName as DeterministicEncryptionKeys

		const encryptor = new Encryptor()

		const decryptedString = await encryptor.deterministicDecrypt(string, encryptionKeyName)
		return res.status(200).json({ decryptedString })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Decrypt Deterministic string" })
	}
}
