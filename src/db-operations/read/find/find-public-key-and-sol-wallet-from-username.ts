import PrismaClientClass from "../../../classes/prisma-client"

export async function findPublicKeyAndSolWalletFromUsername(
	username: string
): Promise<{ solana_wallet_id: number, public_key: string } | null | undefined> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const user = await prismaClient.credentials.findFirst({
			where: {
				username
			},
			select: {
				solana_wallet: {
					select: {
						public_key: true,
						solana_wallet_id: true
					}
				}
			}
		})

		return user?.solana_wallet
	} catch (error) {
		console.error("Error finding user:", error)
		throw error
	}
}
