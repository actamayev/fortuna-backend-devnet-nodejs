import { Request, Response } from "express"
import transformCreatorContentList from "../../utils/transform/transform-creator-content-list"
import retrieveCreatorContentList from "../../db-operations/read/video/retrieve-creator-content-list"

export default async function getCreatorContentList(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet } = req

		const creatorVideoData = await retrieveCreatorContentList(solanaWallet.solana_wallet_id)

		const creatorContentList = transformCreatorContentList(creatorVideoData)

		return res.status(200).json({ creatorContentList })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Creator content list" })
	}
}
