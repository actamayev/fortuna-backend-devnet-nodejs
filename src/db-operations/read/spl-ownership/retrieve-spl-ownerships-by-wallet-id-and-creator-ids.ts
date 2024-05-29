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
						listing_price_per_share_usd: true,
						spl_id: true
					}
				}
			}
		})

		const result: Record<number, number> = {}

		splOwnerships.forEach(splOwnership => {
			result[splOwnership.spl.spl_id] += splOwnership.number_of_shares * splOwnership.spl.listing_price_per_share_usd
		})

		return result
	} catch (error) {
		console.error(error)
		throw error
	}
}
