import _ from "lodash"
import { Request, Response } from "express"
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js"
import getSolPriceInUSD from "../../../utils/solana/get-sol-price-in-usd"

export default async function getDevnetSolanaWalletBalance(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		const publicKey = new PublicKey(solanaWallet.public_key)

		const balanceInLamports = await connection.getBalance(publicKey)
		const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL
		const solPriceInUSD = await getSolPriceInUSD()
		if (_.isNull(solPriceInUSD)) return res.status(400).json({ message: "Cannot retrieve Sol-USD conversion" })

		const balanceInUsd = balanceInSol * solPriceInUSD
		return res.status(200).json({ balanceInSol, balanceInUsd, solPriceInUSD })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Devnet Solana Wallet Balance" })
	}
}
