import { Request, Response, NextFunction } from "express"
import retrieveSplOwnershipByWalletIdAndSplId
	from "../../../../db-operations/read/spl-ownership/retrieve-spl-ownership-by-wallet-id-and-spl-id"

// This middleware ensures that the quantity of the ask amount if less than or equal to:
// The number of tokens the user currently holds minus the sum of the of the quantity of user's open ask orders
export default async function confirmViableAskQuantity(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { solanaWallet } = req
		const createSplAsk = req.body.createSplAsk as CreateSplAskData
		const splOwnerships = await retrieveSplOwnershipByWalletIdAndSplId(solanaWallet.solana_wallet_id, createSplAsk.splPublicKey)

		let numberOfSharesOwned = 0
		splOwnerships.map(ownership => numberOfSharesOwned += ownership.number_of_shares)

		if (numberOfSharesOwned < createSplAsk.numberOfSharesAskingFor) {
			return res.status(400).json({ message: "User does not hold enough shares to create this ask order" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User has enough tokens to create ask" })
	}
}
