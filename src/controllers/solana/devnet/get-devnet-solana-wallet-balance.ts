import _ from "lodash"
import { Request, Response } from "express"
import getWalletBalance from "../../../utils/solana/get-wallet-balance"
import getSolPriceInUSD from "../../../utils/solana/get-sol-price-in-usd"

export default async function getDevnetSolanaWalletBalance(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet
		const solPriceInUSD = await getSolPriceInUSD()
		const solPriceRetrievedTime = new Date()
		if (_.isNull(solPriceInUSD)) return res.status(400).json({ message: "Cannot retrieve Sol-USD conversion" })

		const walletBalanceInfo = await getWalletBalance("devnet", solanaWallet.public_key, solPriceInUSD)
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
