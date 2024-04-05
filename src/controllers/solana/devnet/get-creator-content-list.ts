import { Request, Response } from "express"
import prismaClient from "../../../prisma-client"
import transformCreatorContentList from "../../../utils/solana/transform-creator-content-list"

export default async function getCreatorContentList(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet

		const creatorSPLData = await prismaClient.spl.findMany({
			where: {
				creator_wallet_id: solanaWallet.solana_wallet_id
			},
			select: {
				spl_id: true,
				spl_name: true,
				total_number_of_shares: true,
				listing_price_per_share_sol: true,
				description: true,
				initial_creator_ownership_percentage: true,
				uploaded_image: {
					select: {
						image_url: true
					}
				},
				uploaded_video: {
					select: {
						video_url: true
					}
				},
				public_key_address: true
			}
		})

		const creatorContentList = transformCreatorContentList(creatorSPLData)

		return res.status(200).json({ creatorContentList })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve Creator content list" })
	}
}
