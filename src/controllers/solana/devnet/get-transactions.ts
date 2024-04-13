import { Request, Response } from "express"
import transformTransactionsList from "../../../utils/solana/transform-transactions-list"
import retrieveOutgoingTransactionsList from "../../../utils/db-operations/read/sol-transfer/retrieve-outgoing-transactions-list"
import retrieveIncomingTransactionsList from "../../../utils/db-operations/read/sol-transfer/retrieve-incoming-transactions-list"

export default async function getTransactions(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet

		const outgoingTransactionsList = await retrieveOutgoingTransactionsList(solanaWallet.solana_wallet_id)
		const incomingTransactionsList = await retrieveIncomingTransactionsList(solanaWallet.public_key)

		const combinedTransactionsList = outgoingTransactionsList.concat(incomingTransactionsList)
		const transactions = transformTransactionsList(combinedTransactionsList, solanaWallet.public_key)

		return res.status(200).json({ transactions })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Transactions" })
	}
}
