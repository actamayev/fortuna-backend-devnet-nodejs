import { Request, Response, NextFunction } from "express"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import SolPriceManager from "../../../classes/sol-price-manager"
import { getWalletBalanceSol } from "../../../utils/solana/get-wallet-balance"

export default async function confirmUserHasEnoughSolToTransfer(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { solanaWallet, isRecipientFortunaWallet } = req
		const transferData = req.body.transferSolData as TransferSolData
		const publicKey = new PublicKey(solanaWallet.public_key)
		const balanceInSol = await getWalletBalanceSol(publicKey)

		if (transferData.transferCurrency === "sol") {
			if (isRecipientFortunaWallet === true && balanceInSol < transferData.transferAmount) {
				return res.status(400).json({ message: "User does not have enough sol to complete the internal transfer" })
			} else {
				// This is if the recipient is not registered with Fortuna. In this case, the sender must cover the transaction fee.
				const transferCostSol = 5000 / LAMPORTS_PER_SOL
				// eslint-disable-next-line max-depth
				if (balanceInSol < (transferData.transferAmount + transferCostSol)) {
					return res.status(400).json({ message: "User does not have enough sol to complete the external transfer" })
				}
			}
		} else {
			const solPriceInUSD = (await SolPriceManager.getInstance().getPrice()).price
			if (isRecipientFortunaWallet === true && (balanceInSol * solPriceInUSD) < transferData.transferAmount) {
				return res.status(400).json({ message: "User does not have enough sol to complete the internal transfer" })
			} else {
				// This is if the recipient is not registered with Fortuna. In this case, the sender must cover the transaction fee.
				const transferCostUsd = solPriceInUSD * (5000 / LAMPORTS_PER_SOL)
				// eslint-disable-next-line max-depth
				if ((solPriceInUSD * balanceInSol) < (transferData.transferAmount + transferCostUsd)) {
					return res.status(400).json({ message: "User does not have enough sol to complete the external transfer" })
				}
			}
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User has enough Sol to complete the transfer" })
	}
}
