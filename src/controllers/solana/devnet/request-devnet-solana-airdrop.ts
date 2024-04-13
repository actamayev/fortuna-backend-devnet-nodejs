import { Request, Response } from "express"
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"
import getWalletBalance from "../../../utils/solana/get-wallet-balance"

export default async function requestDevnetSolanaAirdrop(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		const publicKey = new PublicKey(solanaWallet.public_key)

		const latestBlockHash = await connection.getLatestBlockhash()

		const signature = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL)

		await connection.confirmTransaction({
			blockhash: latestBlockHash.blockhash,
			lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
			signature
		})
		const walletBalance = await getWalletBalance("devnet", solanaWallet.public_key)
		if (walletBalance === undefined) return res.status(400).json({ message: "Unable to get Wallet Balance" })

		return res.status(200).json({
			balanceInSol: walletBalance.balanceInSol,
			balanceInUsd: walletBalance.balanceInUsd
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Request Devnet Solana Airdrop" })
	}
}
