import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveSplOwnershipsByWalletIdAndSplIds(
	splIds: number[],
	solanaWalletId: number
): Promise<Record<number, number>> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const splOwnerships = await prismaClient.spl_ownership.findMany({
			where: {
				solana_wallet_id: solanaWalletId,
				spl: {
					spl_id: { in: splIds }
				},
				number_of_shares: {
					gt: 0
				}
			},
			select: {
				spl_id: true,
				number_of_shares: true
			}
		})

		const result: Record<number, number> = {}

		splOwnerships.forEach(splOwnership => {
			if (!result[splOwnership.spl_id]) result[splOwnership.spl_id] = 0
			result[splOwnership.spl_id] += splOwnership.number_of_shares
		})

		return result
	} catch (error) {
		console.error(error)
		throw error
	}
}
