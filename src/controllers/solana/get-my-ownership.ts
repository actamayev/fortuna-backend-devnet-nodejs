import { Request, Response } from "express"
import transformOwnershipList from "../../utils/transform/transform-ownership-list"
import aggregateOwnershipList from "../../utils/transform/aggregate-ownership-list"
import getSplOwnershipsByWalletId from "../../db-operations/read/spl-ownership/retrieve-spl-ownerships-by-wallet-id"

export default async function getMyOwnership(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet } = req

		const myOwnership = await getSplOwnershipsByWalletId(solanaWallet.solana_wallet_id)
		const aggregatedOwnership = aggregateOwnershipList(myOwnership)
		const myOwnershipList = transformOwnershipList(aggregatedOwnership, solanaWallet.solana_wallet_id)

		return res.status(200).json({ myOwnershipList })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve my ownership" })
	}
}
