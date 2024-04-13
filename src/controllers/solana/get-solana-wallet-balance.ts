import { Request, Response } from "express"
import SolPriceManager from "../../classes/sol-price-manager"
import getWalletBalance from "../../utils/solana/get-wallet-balance"

export default async function getSolanaWalletBalance(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet
		const walletBalanceInfo = await getWalletBalance(solanaWallet.public_key)
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()

		return res.status(200).json({
			balanceInSol: walletBalanceInfo.balanceInSol,
			balanceInUsd: walletBalanceInfo.balanceInUsd,
			solPriceInUSD: solPriceDetails.price,
			solPriceRetrievedTime: solPriceDetails.fetchedAt
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Solana Wallet Balance" })
	}
}
