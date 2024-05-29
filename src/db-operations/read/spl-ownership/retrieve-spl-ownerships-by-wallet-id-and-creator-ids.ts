import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveSplOwnershipsByWalletIdAndCreatorIds(
	solanaWalletId: number,
	splCreatorWalletId: number[]
): Promise<Record<number, number>> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const splOwnerships = await prismaClient.spl_ownership.findMany({
			where: {
				solana_wallet_id: solanaWalletId,
				spl: {
					creator_wallet_id: { in: splCreatorWalletId }
				},
				number_of_shares: {
					gt: 0
				}
			},
			select: {
				number_of_shares: true,
				spl: {
					select: {
						spl_id: true,
						listing_price_per_share_usd: true
					}
				}
			}
		})

		const result: Record<number, number> = {}

		splOwnerships.forEach(splOwnership => {
			const splId = splOwnership.spl.spl_id
			if (!result[splId]) result[splId] = 0
			result[splId] += splOwnership.number_of_shares * splOwnership.spl.listing_price_per_share_usd
		})

		return result
	} catch (error) {
		console.error(error)
		throw error
	}
}
