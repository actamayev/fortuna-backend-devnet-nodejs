import PrismaClientClass from "../../../../classes/prisma-client"

export default async function addSplOwnership(
	splId: number,
	numberOfShares: number,
	solanaWalletId: number,
	purchasePricePerShareUsd: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.spl_ownership.create({
			data: {
				spl_id: splId,
				solana_wallet_id: solanaWalletId,
				number_of_shares: numberOfShares,
				purchase_price_per_share_usd: purchasePricePerShareUsd
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
