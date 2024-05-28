import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveSplOwnershipForEscrowMap(solanaWalletId: number): Promise<Map<string, number>> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const splOwnerships = await prismaClient.spl_ownership.findMany({
			where: {
				solana_wallet_id: solanaWalletId,
				spl: {
					spl_listing_status: {
						notIn: ["PRELISTING"]
					}
				}
			},
			select: {
				number_of_shares: true,
				spl: {
					select: {
						public_key_address: true
					}
				}
			}
		})

		const sharesMap = new Map<string, number>()

		splOwnerships.forEach(splOwnership => {
			const publicKey = splOwnership.spl.public_key_address
			const currentShares = sharesMap.get(publicKey) || 0
			sharesMap.set(publicKey, currentShares + splOwnership.number_of_shares)
		})

		return sharesMap
	} catch (error) {
		console.error(error)
		throw error
	}
}
