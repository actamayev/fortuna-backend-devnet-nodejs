import { Request, Response } from "express"
import SolPriceManager from "../../../classes/sol-price-manager"
import getWalletBalance from "../../../utils/solana/get-wallet-balance"

export default async function getDevnetSolanaWalletBalance(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet
		const solPriceRetrievedTime = new Date()
		const solPriceInUSD = await SolPriceManager.getInstance().getPrice()
		const walletBalanceInfo = await getWalletBalance("devnet", solanaWallet.public_key)
		if (walletBalanceInfo === undefined) return res.status(400).json({ message: "Cannot retrieve wallet balance info" })

		return res.status(200).json({
			balanceInSol: walletBalanceInfo.balanceInSol,
			balanceInUsd: walletBalanceInfo.balanceInUsd,
			solPriceInUSD,
			solPriceRetrievedTime
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Devnet Solana Wallet Balance" })
	}
}
