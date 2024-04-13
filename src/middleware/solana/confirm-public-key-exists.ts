import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import { Connection, clusterApiUrl } from "@solana/web3.js"

export default async function confirmPublicKeyExists(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const recipientPublicKey = req.recipientPublicKey

		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const accountInfo = await connection.getAccountInfo(recipientPublicKey)

		if (_.isNull(accountInfo)) return res.status(400).json({ message: "Recipient Public key does not exist" })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if Public Key exists" })
	}
}
