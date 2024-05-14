import { Request, Response, NextFunction } from "express"
import retrieveSplOwnershipByWalletIdAndSplId
	from "../../../db-operations/read/spl-ownership/retrieve-spl-ownership-by-wallet-id-and-spl-id"

export default async function confirmUserHasEnoughTokensToCreateSplAsk(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { solanaWallet } = req
		const createSplAsk = req.body.createSplAsk as CreateSplAskData
		const splOwnerships = await retrieveSplOwnershipByWalletIdAndSplId(solanaWallet.solana_wallet_id, createSplAsk.splPublicKey)

		let numberOfShares = 0
		splOwnerships.map(ownership => numberOfShares += ownership.number_of_shares)

		if (numberOfShares < createSplAsk.numberOfSharesAskingFor) {
			return res.status(400).json({ message: "User does not hold enough shares to create this ask order" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User has enough Sol to create ask" })
	}
}
