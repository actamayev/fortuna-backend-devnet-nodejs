import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveCreatorWalletInfoFromVideo(
	videoId: number
): Promise<{ public_key: PublicKey, solana_wallet_id: number } | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const creatorSPLData = await prismaClient.video.findFirst({
			where: {
				video_id: videoId
			},
			orderBy: {
				created_at: "desc"
			},
			select: {
				video_creator_wallet: {
					select: {
						public_key: true,
						solana_wallet_id: true
					}
				}
			}
		})

		if (_.isNull(creatorSPLData)) return null

		return {
			public_key: new PublicKey(creatorSPLData.video_creator_wallet.public_key),
			solana_wallet_id: creatorSPLData.video_creator_wallet.solana_wallet_id
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
