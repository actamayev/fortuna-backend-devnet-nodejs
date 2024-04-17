import { Request, Response } from "express"
import getSplOwnershipsByWalletId from "../../utils/db-operations/read/spl-ownership.ts/retrieve-spl-ownership-by-wallet-id"

export default async function getMyOwnership(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet

		const myOwnership = await getSplOwnershipsByWalletId(solanaWallet.solana_wallet_id)

		return res.status(200).json({ myOwnership })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve my ownership" })
	}
}
