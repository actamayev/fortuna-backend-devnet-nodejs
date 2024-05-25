import { PublicKey } from "@solana/web3.js"
import { Request, Response, NextFunction } from "express"
import SolPriceManager from "../../../../classes/sol-price-manager"
import { getWalletBalanceSol } from "../../../../utils/solana/get-wallet-balance"

export default async function confirmUserHasEnoughSolToPurchaseExclusiveAccess(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { solanaWallet, exclusiveVideoData } = req
		const publicKey = new PublicKey(solanaWallet.public_key)
		const balanceInSol = await getWalletBalanceSol(publicKey)

		const solPriceInUSD = (await SolPriceManager.getInstance().getPrice()).price
		const balanceInUsd = balanceInSol * solPriceInUSD
		const exclusiveListingPrice = exclusiveVideoData.listing_price_to_access_exclusive_content_usd

		if (balanceInUsd < exclusiveListingPrice) {
			return res.status(400).json({ message: "User does not have enough Sol to complete the purchase" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User has enough Sol to purchase exclusive content"})
	}
}
