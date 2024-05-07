import { Request, Response } from "express"
import Encryptor from "../../classes/encryptor"

export default async function decryptString(req: Request, res: Response): Promise<Response> {
	try {
		const string = req.body.stringToDecrypt as EncryptedString
		const encryptionKeyName = req.body.encryptionKeyName as EncryptionKeys

		const encryptor = new Encryptor()

		const decryptedString = await encryptor.decrypt(string, encryptionKeyName)
		return res.status(200).json({ decryptedString })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Decrypt string" })
	}
}
