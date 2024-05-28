import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function findPublicKeyAndSolWalletFromUsername(
	username: string
): Promise<{ solana_wallet_id: number, public_key: string } | null> {
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

		if (_.isNull(solanaWalletDetails)) return null

		return solanaWalletDetails.solana_wallet
	} catch (error) {
		console.error("Error finding user:", error)
		throw error
	}
}
