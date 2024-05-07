import { Request, Response } from "express"
import Encryptor from "../../classes/encryptor"

// ASAP TODO: Go through each of the secret keys in the local and production environents and encrypt them one by one.
// Check the Notes app for examples of more fields to encrypt. Make sure to encrypt all of these fields before adding them to db.
export default async function encryptString(req: Request, res: Response): Promise<Response> {
	try {
		const string = req.body.stringToEncrypt
		const encryptionKeyName = req.body.encryptionKeyName as EncryptionKeys
		const encryptor = new Encryptor()

		const encryptedString = await encryptor.encrypt(string, encryptionKeyName)
		return res.status(200).json({ encryptedString })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Encrypt string" })
	}
}
