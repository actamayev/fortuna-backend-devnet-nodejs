import PrismaClientClass from "../../../classes/prisma-client"

export default async function addSplOwnership(
	splId: number,
	numberOfShares: number,
	solanaWalletId: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.$transaction(async (prisma) => {

			await prisma.spl_ownership.create({
				data: {
					spl_id: splId,
					solana_wallet_id: solanaWalletId,
					number_of_shares: numberOfShares
				}
			})
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
