import { Request, Response } from "express"
import prismaClient from "../../../prisma-client"

export default async function getCreatorContentList(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet

		const creatorSPLData = await prismaClient.spl.findMany(
			{ where: {
				creator_wallet_id: solanaWallet.solana_wallet_id
			}}
		)

		// will need to perform joins on the spl data to retrieve all necessary data
		return res.status(200).json({ })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Creator content list" })
	}
}
