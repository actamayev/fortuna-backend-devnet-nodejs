import { Request, Response } from "express"

export default function retrieveWalletPublicKey(req: Request, res: Response): Response {
	try {
		const solanaWallet = req.solanaWallet

		return res.status(200).json({ publicKey: solanaWallet.public_key })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve public key" })
	}
}
