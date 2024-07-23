import { Request, Response } from "express"
import transformTransactionsList from "../../utils/transform/transform-transactions-list"
import retrieveOutgoingTransactionsList from "../../db-operations/read/sol-transfer/retrieve-outgoing-transactions-list"
import retrieveIncomingTransactionsList from "../../db-operations/read/sol-transfer/retrieve-incoming-transactions-list"

export default async function getSolanaTransactions(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet } = req

		const outgoingTransactionsList = await retrieveOutgoingTransactionsList(solanaWallet.solana_wallet_id)
		const incomingTransactionsList = await retrieveIncomingTransactionsList(solanaWallet.public_key)

		const transactions = transformTransactionsList(outgoingTransactionsList, incomingTransactionsList)

		return res.status(200).json({ transactions })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Transactions" })
	}
}
