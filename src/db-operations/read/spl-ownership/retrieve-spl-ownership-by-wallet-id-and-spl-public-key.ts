import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveSplOwnershipByWalletIdAndSplPublicKey(
	solanaWalletId: number,
	splPublicKey: string
): Promise<{
	spl_ownership_id: number,
	number_of_shares: number
}[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const splOwnership = await prismaClient.spl_ownership.findMany({
			where: {
				solana_wallet_id: solanaWalletId,
				spl: {
					public_key_address: splPublicKey
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
				number_of_shares: true
			}
		})

		return splOwnership
	} catch (error) {
		console.error(error)
		throw error
	}
}
