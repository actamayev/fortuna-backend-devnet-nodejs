import { PublicKey } from "@solana/web3.js"
import { Request, Response, NextFunction } from "express"
import SolPriceManager from "../../../classes/sol-price-manager"
import { getWalletBalanceSol } from "../../../utils/solana/get-wallet-balance"

export async function confirmUserHasEnoughSolToPurchasePrimaryTokens(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { solanaWallet, splDetails } = req
		const purchaseSplTokensData = req.body.purchaseSplTokensData as PurchasePrimarySPLTokensData
		const publicKey = new PublicKey(solanaWallet.public_key)
		const balanceInSol = await getWalletBalanceSol(publicKey)

		const solPriceInUSD = (await SolPriceManager.getInstance().getPrice()).price
		const balanceInUsd = balanceInSol * solPriceInUSD
		const totalPurchasePriceInUsd = splDetails.listingSharePriceUsd * purchaseSplTokensData.numberOfTokensPurchasing

		if (balanceInUsd < totalPurchasePriceInUsd) {
			return res.status(400).json({ message: "User does not have enough Sol to complete the purchase" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User has enough Sol to purchase tokens" })
	}
}

export async function confirmUserHasEnoughSolToBidForSecondaryTokens(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { solanaWallet } = req
		const createSplBid = req.body.createSplBid as CreateSplBidData
		const publicKey = new PublicKey(solanaWallet.public_key)
		const balanceInSol = await getWalletBalanceSol(publicKey)

		const solPriceInUSD = (await SolPriceManager.getInstance().getPrice()).price
		const balanceInUsd = balanceInSol * solPriceInUSD
		const totalPurchasePriceInUsd = createSplBid.bidPricePerShareUsd * createSplBid.numberOfSharesBiddingFor

		if (balanceInUsd < totalPurchasePriceInUsd) {
			return res.status(400).json({ message: "User does not have enough Sol to create the bid" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User has enough Sol to create bid" })
	}
}
