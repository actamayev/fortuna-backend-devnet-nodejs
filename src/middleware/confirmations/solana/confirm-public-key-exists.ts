import { PublicKey } from "@solana/web3.js"
import { Request, Response, NextFunction } from "express"

export default function confirmPublicKeyExists(req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const recipientPublicKey = req.recipientPublicKey

		const isOnSolana = PublicKey.isOnCurve(recipientPublicKey)

		if (isOnSolana === false) return res.status(400).json({ message: "Recipient Public key does not exist" })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Public Key exists" })
	}
}
