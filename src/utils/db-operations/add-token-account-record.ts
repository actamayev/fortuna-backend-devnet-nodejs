import prismaClient from "../../prisma-client"

export default async function addTokenAccountRecord (splId: number, solanaWalletId: number): Promise<void> {
	try {
		await prismaClient.token_account.create({
			data: {
				spl_id: splId,
				solana_wallet_id: solanaWalletId
			}
		})
	} catch (error) {
		console.error(error)
	}
}
