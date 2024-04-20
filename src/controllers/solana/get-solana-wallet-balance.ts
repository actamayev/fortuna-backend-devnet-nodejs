import { Request, Response } from "express"
import { getWalletBalanceWithUSD } from "../../utils/solana/get-wallet-balance"

export default async function getSolanaWalletBalance(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet
		const walletBalanceInfo = await getWalletBalanceWithUSD(solanaWallet.public_key)

		return res.status(200).json({
			balanceInSol: walletBalanceInfo.balanceInSol,
			balanceInUsd: walletBalanceInfo.balanceInUsd,
			solPriceInUSD: walletBalanceInfo.solPriceInUSD,
			solPriceRetrievedTime: walletBalanceInfo.solPriceRetrievedTime
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Solana Wallet Balance" })
	}
}
