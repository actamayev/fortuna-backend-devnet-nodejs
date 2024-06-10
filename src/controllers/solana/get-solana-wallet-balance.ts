import { Request, Response } from "express"
import { PublicKey } from "@solana/web3.js"
import { getWalletBalanceWithUSD } from "../../utils/solana/get-wallet-balance"

export default async function getSolanaWalletBalance(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet } = req
		const publicKey = new PublicKey(solanaWallet.public_key)
		const walletBalanceInfo = await getWalletBalanceWithUSD(publicKey)

		return res.status(200).json({ ...walletBalanceInfo })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Solana Wallet Balance" })
	}
}
