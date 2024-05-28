import { PublicKey } from "@solana/web3.js"
import { Request, Response, NextFunction } from "express"
import { getWalletBalanceWithUSD } from "../../../../utils/solana/get-wallet-balance"

export default async function confirmUserHasEnoughSolToPurchaseExclusiveAccess(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { solanaWallet, exclusiveVideoData } = req
		const publicKey = new PublicKey(solanaWallet.public_key)
		const walletBalance = await getWalletBalanceWithUSD(publicKey)

		const exclusiveListingPrice = exclusiveVideoData.instant_access_price_to_exclusive_content_usd

		if (walletBalance.balanceInUsd < exclusiveListingPrice) {
			return res.status(400).json({ message: "User does not have enough Sol to complete the purchase" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User has enough Sol to purchase exclusive content"})
	}
}
