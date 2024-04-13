import _ from "lodash"
import prismaClient from "../../../../prisma-client"

export async function findPublicKeyAndSolWalletFromUsername(
	username: string
): Promise<{ solana_wallet_id: number, public_key: string} | null> {
	try {
		const user = await prismaClient.credentials.findFirst({
			where: {
				username: {
					equals: username,
					mode: "insensitive"
				},
			},
			select: {
				solana_wallet: {
					select: {
						public_key: true,
						solana_wallet_id: true
					},
					where: {
						network_type: "devnet"
					}
				}
			}
		})
		if (_.isNull(user)) return null

		return user.solana_wallet[0]
	} catch (error) {
		console.error("Error finding user:", error)
		return null
	}
}
