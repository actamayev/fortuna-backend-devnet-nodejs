import { Request, Response } from "express"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"

export default async function checkIfPublicKeyExistsOnSolanaDevnet(req: Request, res: Response): Promise<Response> {
	try {
		const publicKeyStr = req.params.publicKey as string
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const publicKey = new PublicKey(publicKeyStr)

		const accountInfo = await connection.getAccountInfo(publicKey)

		return res.status(200).json({ exists: accountInfo !== null })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check If Public Key Exists on Solana" })
	}
}
