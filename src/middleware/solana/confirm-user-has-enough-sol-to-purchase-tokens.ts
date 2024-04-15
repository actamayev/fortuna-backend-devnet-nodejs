import { Request, Response, NextFunction } from "express"
import { getWalletBalanceSol } from "../../utils/solana/get-wallet-balance"

export default async function confirmUserHasEnoughSolToPurchaseTokens(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> {
	try {
		const solanaWallet = req.solanaWallet
		const splDetails = req.splDetails
		const purchaseSplTokensData = req.body.purchaseSplTokensData as PurchaseSPLTokensData
		const balanceInSol = await getWalletBalanceSol(solanaWallet.public_key)

		if (balanceInSol < splDetails.listingPricePerShareSol * purchaseSplTokensData.numberOfTokensPurchasing) {
			return res.status(400).json({ message: "User does not have enough Sol to complete the purchase" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User has enough Sol to complete the transfer" })
	}
}
