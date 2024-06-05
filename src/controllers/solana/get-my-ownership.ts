import { Request, Response } from "express"
import { transformExclusiveContentList } from "../../utils/transform/transform-exclusive-content-list"
import retrieveExclusiveAccessByWalletId
	from "../../db-operations/read/exclusive-video-access-purchase/retrieve-exclusive-access-by-wallet-id"

export default async function getMyOwnership(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet } = req

		const myExclusiveContent = await retrieveExclusiveAccessByWalletId(solanaWallet.solana_wallet_id)
		const myExclusiveContentList = transformExclusiveContentList(myExclusiveContent)

		return res.status(200).json({ myExclusiveContentList })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve my ownership" })
	}
}
