import _ from "lodash"
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
		const numberOfSharesUserHas = await retrieveSplOwnershipByWalletIdAndSplId(solanaWallet.solana_wallet_id, createSplAsk.splPublicKey)

		if (_.isNull(numberOfSharesUserHas)) return res.status(500).json({ error: "Unable to retrieve user's share count" })
		if (numberOfSharesUserHas.number_of_shares < createSplAsk.numberOfSharesAskingFor) {
			return res.status(400).json({ message: "User does not hold enough shares to create this ask order" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Check if User has enough Sol to create ask" })
	}
}
