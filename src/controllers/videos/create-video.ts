import { Request, Response } from "express"
import addSPLRecord from "../../db-operations/write/video/add-spl-record"

export default async function createVideo (req: Request, res: Response): Promise<Response> {
	try {
		const creatorSolanaWallet = req.solanaWallet
		const newVideoData = req.body.newVideoData as IncomingNewVideoData

		const newVideoId = await addSPLRecord(newVideoData, creatorSolanaWallet.solana_wallet_id)

		return res.status(200).json({ newVideoId })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create Video" })
	}
}
