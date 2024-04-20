import { Request, Response } from "express"
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"
import { getWalletBalanceWithUSD } from "../../utils/solana/get-wallet-balance"

export default async function requestSolanaAirdrop(req: Request, res: Response): Promise<Response> {
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
		const walletBalance = await getWalletBalanceWithUSD(solanaWallet.public_key)

		return res.status(200).json({
			balanceInSol: walletBalance.balanceInSol,
			balanceInUsd: walletBalance.balanceInUsd,
			solPriceInUSD: walletBalance.solPriceInUSD,
			solPriceRetrievedTime: walletBalance.solPriceRetrievedTime
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Request Solana Airdrop" })
	}
}
