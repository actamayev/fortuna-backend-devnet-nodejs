import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveSplOwnershipForEscrowMap(solanaWalletId: number): Promise<RetrievedSplOwnershipMapData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const splOwnerships = await prismaClient.spl_ownership.findMany({
			where: {
				solana_wallet_id: solanaWalletId
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

		return splOwnerships
	} catch (error) {
		console.error(error)
		throw error
	}
}
