import _ from "lodash"
import { Request, Response } from "express"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import findSolanaWallet from "../../../utils/find/find-solana-wallet"

export default async function getDevnetSolanaWalletBalance(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		const solanaWallet = await findSolanaWallet(user.user_id, "DEVNET")
		if (_.isNil(solanaWallet)) return res.status(400).json({ message: "Cannot find Devnet Solana Wallet" })

		const publicKey = new PublicKey(solanaWallet.public_key)

		const balance = await connection.getBalance(publicKey)
		return res.status(200).json({ balance })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Devnet Solana Wallet Balance" })
	}
}
