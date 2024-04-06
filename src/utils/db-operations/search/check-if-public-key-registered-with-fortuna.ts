import prismaClient from "../../../prisma-client"

export default async function checkIfPublicKeyRegisteredWithFortuna(publicKey: string): Promise<boolean | undefined> {
	try {
		const count = await prismaClient.solana_wallet.count({
			where: {
				public_key: publicKey
			}
		})

		return count > 0
	} catch (error) {
		console.error("Error adding login record:", error)
	}
}
