import { Request, Response, NextFunction } from "express"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import SolPriceManager from "../../../classes/solana/sol-price-manager"
import { getWalletBalanceSol } from "../../../utils/solana/get-wallet-balance"

export default async function confirmUserHasSufficientFundsToTransfer(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { solanaWallet, isRecipientFortunaWallet } = req
		const moneyTransferData = req.body.moneyTransferData as MoneyTransferData
		const publicKey = new PublicKey(solanaWallet.public_key)
		const balanceInSol = await getWalletBalanceSol(publicKey)

		if (moneyTransferData.transferCurrency === "sol") {
			if (isRecipientFortunaWallet === true && balanceInSol < moneyTransferData.transferAmount) {
				return res.status(400).json({ message: "User has insufficient funds to complete the internal transfer" })
			} else {
				// This is if the recipient is not registered with Fortuna. In this case, the sender must cover the transaction fee.
				const transferCostSol = 5000 / LAMPORTS_PER_SOL
				// eslint-disable-next-line max-depth
				if (balanceInSol < (moneyTransferData.transferAmount + transferCostSol)) {
					return res.status(400).json({ message: "User has insufficient funds to complete the external transfer" })
				}
			}
		} else {
			const solPriceInUSD = (await SolPriceManager.getInstance().getPrice()).price
			if (isRecipientFortunaWallet === true && (balanceInSol * solPriceInUSD) < moneyTransferData.transferAmount) {
				return res.status(400).json({ message: "User has insufficient funds to complete the internal transfer" })
			} else {
				// This is if the recipient is not registered with Fortuna. In this case, the sender must cover the transaction fee.
				const transferCostUsd = solPriceInUSD * (5000 / LAMPORTS_PER_SOL)
				// eslint-disable-next-line max-depth
				if ((solPriceInUSD * balanceInSol) < (moneyTransferData.transferAmount + transferCostUsd)) {
					return res.status(400).json({ message: "User has insufficient funds to complete the external transfer" })
				}
			}
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({error: "Internal Server Error: Unable to Check if User has sufficient funds to complete the transfer"})
	}
}
