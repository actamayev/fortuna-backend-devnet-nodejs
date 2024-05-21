import { Request, Response } from "express"
import { transformUserAsks, transformUserBids } from "../../utils/transform/transform-user-orders"
import retrieveAsksByWalletId from "../../db-operations/read/secondary-market/ask/retrieve-asks-by-wallet-id"
import retrieveBidsByWalletId from "../../db-operations/read/secondary-market/bid/retrieve-bids-by-wallet-id"

export default async function retrieveUserOrders(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet } = req

		const retrievedAsks = await retrieveAsksByWalletId(solanaWallet.solana_wallet_id)
		const retrievedBids = await retrieveBidsByWalletId(solanaWallet.solana_wallet_id)

		retrievedAsks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
		retrievedBids.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

		const asks = transformUserAsks(retrievedAsks)
		const bids = transformUserBids(retrievedBids)

		return res.status(200).json({ asks, bids })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve user's orders" })
	}
}
