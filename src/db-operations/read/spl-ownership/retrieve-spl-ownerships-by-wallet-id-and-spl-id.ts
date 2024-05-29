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
			orderBy: {
				created_at: "asc"
			},
			select: {
				number_of_shares: true,
				spl_id: true
			}
		})

		const result: Record<number, number> = {}

		splOwnerships.forEach(splOwnership => {
			result[splOwnership.spl_id] += splOwnership.number_of_shares
		})

		return result
	} catch (error) {
		console.error(error)
		throw error
	}
}
