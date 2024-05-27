import { Request, Response } from "express"
import transformOwnershipList from "../../utils/transform/transform-ownership-list"
import aggregateOwnershipList from "../../utils/transform/aggregate-ownership-list"
import { transformExclusiveContentList } from "../../utils/transform/transform-exclusive-content-list"
import retrieveSplOwnershipsByWalletId from "../../db-operations/read/spl-ownership/retrieve-spl-ownerships-by-wallet-id"
import retrieveExclusiveAccessByWalletId from "../../db-operations/read/exclusive-spl-purchase/retrieve-exclusive-access-by-wallet-id"

export default async function getMyOwnership(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet } = req

		const myOwnership = await retrieveSplOwnershipsByWalletId(solanaWallet.solana_wallet_id)
		const aggregatedOwnership = aggregateOwnershipList(myOwnership)
		const myOwnershipList = transformOwnershipList(aggregatedOwnership, solanaWallet.solana_wallet_id)

		const myExclusiveContent = await retrieveExclusiveAccessByWalletId(solanaWallet.solana_wallet_id)
		const myExclusiveContentList = transformExclusiveContentList(myExclusiveContent)

		return res.status(200).json({ myOwnershipList, myExclusiveContentList })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve my ownership" })
	}
}
