import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveSplOwnershipByWalletIdAndCreatorId(
	solanaWalletId: number,
	splCreatorWalletId: number
): Promise<{
    spl_ownership_id: number
    number_of_shares: number
    spl: { listing_price_per_share_usd: number }
}[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const splOwnership = await prismaClient.spl_ownership.findMany({
			where: {
				solana_wallet_id: solanaWalletId,
				spl: {
					creator_wallet_id: splCreatorWalletId
				},
				number_of_shares: {
					gt: 0
				}
			},
			orderBy: {
				created_at: "asc"
			},
			select: {
				spl_ownership_id: true,
				number_of_shares: true,
				spl: {
					select: {
						listing_price_per_share_usd: true
					}
				}
			}
		})

		return splOwnership
	} catch (error) {
		console.error(error)
		throw error
	}
}
