import { Request, Response } from "express"
import { Connection, clusterApiUrl } from "@solana/web3.js"

export default async function getTransactionDetails(req: Request, res: Response): Promise<Response> {
	try {
		const transactionData = req.body as string[]

		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const transactionDetails = await connection.getTransaction(
			transactionData[0],
			{ commitment: "confirmed", maxSupportedTransactionVersion: 0 }
		)
		return res.status(200).json({ transactionDetails })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Get Transaction Fee" })
	}
}
