import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveSplOwnershipsByWalletIdAndCreatorIds(
	solanaWalletId: number,
	splCreatorWalletIds: number[]
): Promise<Record<number, number>> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const splOwnerships = await prismaClient.spl_ownership.findMany({
			where: {
				solana_wallet_id: solanaWalletId,
				spl: {
					creator_wallet_id: { in: splCreatorWalletIds }
				},
				number_of_shares: {
					gt: 0
				}
			},
			select: {
				number_of_shares: true,
				spl: {
					select: {
						listing_price_per_share_usd: true,
						creator_wallet_id: true
					}
				}
			}
		})

		const result: Record<number, number> = {}

		splOwnerships.forEach(splOwnership => {
			const creatorWalletId = splOwnership.spl.creator_wallet_id
			if (!result[creatorWalletId]) result[creatorWalletId] = 0
			result[creatorWalletId] += splOwnership.number_of_shares * splOwnership.spl.listing_price_per_share_usd
		})

		return result
	} catch (error) {
		console.error(error)
		throw error
	}
}
