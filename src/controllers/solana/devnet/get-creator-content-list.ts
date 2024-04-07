import { Request, Response } from "express"
import transformCreatorContentList from "../../../utils/solana/transform-creator-content-list"
import retrieveCreatorContentList from "../../../utils/db-operations/read/spl/retrieve-creator-content-list"

export default async function getCreatorContentList(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet

		const creatorSPLData = await retrieveCreatorContentList(solanaWallet.solana_wallet_id)

		if (creatorSPLData === undefined) return res.status(400).json({ message: "Unable to retrieve Creator Content List" })
		const creatorContentList = transformCreatorContentList(creatorSPLData)

		return res.status(200).json({ creatorContentList })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Creator content list" })
	}
}
