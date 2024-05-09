import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveSplOwnershipByWalletIdAndSplId(
	solanaWalletId: number,
	splPublicKey: string
): Promise<{ number_of_shares: number } | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const splOwnership = await prismaClient.spl_ownership.findFirst({
			where: {
				token_account: {
					parent_solana_wallet_id: solanaWalletId
				},
				spl: {
					public_key_address: splPublicKey
				}
			},
			select: {
				number_of_shares: true,
			}
		})

		return splOwnership
	} catch (error) {
		console.error(error)
		throw error
	}
}
