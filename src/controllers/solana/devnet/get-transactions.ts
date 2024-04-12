import { Request, Response } from "express"
import transformTransactionsList from "../../../utils/solana/transform-transactions-list"
import retrieveTransactionsList from "../../../utils/db-operations/read/sol-transfer/retrieve-transactions-list"

export default async function getTransactions(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet

		const transactionList = await retrieveTransactionsList(solanaWallet.solana_wallet_id)

		if (transactionList === undefined) return res.status(400).json({ message: "Unable to retrieve Creator Content List" })
		const transactions = transformTransactionsList(transactionList)

		return res.status(200).json({ transactions })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Creator content list" })
	}
}
