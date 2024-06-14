import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function findPublicKeyAndSolWalletFromUsername(
	username: string
): Promise<CreatorWalletDataLessSecretKey | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const solanaWalletDetails = await prismaClient.credentials.findFirst({
			where: {
				username: {
					equals: username,
					mode: "insensitive"
				}
			},
			select: {
				solana_wallet: {
					select: {
						public_key: true,
						solana_wallet_id: true
					}
				}
			}
		})

		if (_.isNull(solanaWalletDetails) || (_.isNull(solanaWalletDetails.solana_wallet))) return null

		return {
			solana_wallet_id: solanaWalletDetails.solana_wallet.solana_wallet_id,
			public_key: new PublicKey(solanaWalletDetails.solana_wallet.public_key)
		}
	} catch (error) {
		console.error("Error finding user:", error)
		throw error
	}
}
