import { Request, Response } from "express"
import checkIfPublicKeyRegisteredWithFortuna from "../../utils/db-operations/read/search/check-if-public-key-registered-with-fortuna"

export default async function checkIfPublicKeyExistsWithFortuna(req: Request, res: Response): Promise<Response> {
	try {
		const publicKey = req.params.publicKey as string

		const exists = await checkIfPublicKeyRegisteredWithFortuna(publicKey)

		return res.status(200).json({ exists })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to check if Public Key exists with Fortuna" })
	}
}
