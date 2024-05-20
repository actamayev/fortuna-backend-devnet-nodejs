import { Request, Response } from "express"
import retrieveAsksByWalletId from "../../db-operations/read/secondary-market/ask/retrieve-asks-by-wallet-id"
import retrieveBidsByWalletId from "../../db-operations/read/secondary-market/bid/retrieve-bids-by-wallet-id"

export default async function retrieveUserOrders(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet } = req

		const asks = await retrieveAsksByWalletId(solanaWallet.solana_wallet_id)
		const bids = await retrieveBidsByWalletId(solanaWallet.solana_wallet_id)

		const combinedOrders = [...asks, ...bids]

		combinedOrders.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

		return res.status(200).json({ combinedOrders })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve user's orders" })
	}
}
