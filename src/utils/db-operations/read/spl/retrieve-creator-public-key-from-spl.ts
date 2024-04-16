import prismaClient from "../../../../prisma-client"

export default async function retrieveCreatorPublicKeyFromSpl(
	splId: number
): Promise<{ public_key: string, solana_wallet_id: number } | undefined> {
	try {
		const creatorSPLData = await prismaClient.spl.findFirst({
			where: {
				spl_id: splId
			},
			orderBy: {
				created_at: "desc"
			},
			select: {
				spl_creator_wallet: {
					select: {
						public_key: true,
						solana_wallet_id: true
					}
				}
			}
		})

		return creatorSPLData?.spl_creator_wallet
	} catch (error) {
		console.error(error)
		throw error
	}
}
