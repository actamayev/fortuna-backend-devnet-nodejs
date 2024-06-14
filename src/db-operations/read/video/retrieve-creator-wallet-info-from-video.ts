import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveCreatorWalletInfoFromVideo(videoId: number): Promise<CreatorWalletData | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const creatorWalletData = await prismaClient.video.findFirst({
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
						solana_wallet_id: true,
						secret_key__encrypted: true
					}
				}
			}
		})

		if (_.isNull(creatorWalletData)) return null

		return {
			public_key: new PublicKey(creatorWalletData.video_creator_wallet.public_key),
			secret_key__encrypted: creatorWalletData.video_creator_wallet.secret_key__encrypted as NonDeterministicEncryptedString,
			solana_wallet_id: creatorWalletData.video_creator_wallet.solana_wallet_id
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
