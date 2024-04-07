import _ from "lodash"
import prismaClient from "../../../../prisma-client"

export async function findPublicKeyFromUsername(username: string): Promise<string | null> {
	try {
		const user = await prismaClient.credentials.findFirst({
			where: {
				username: {
					equals: username,
					mode: "insensitive"
				},
			}, select: {
				solana_wallet: {
					select: {
						public_key: true
					},
					where: {
						network_type: "devnet"
					}
				}
			}
		})
		if (_.isNull(user)) return null

		return user.solana_wallet[0].public_key
	} catch (error) {
		console.error("Error finding user:", error)
		return null
	}
}
