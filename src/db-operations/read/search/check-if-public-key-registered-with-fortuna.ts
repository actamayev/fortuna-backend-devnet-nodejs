import PrismaClientClass from "../../../classes/prisma-client"

export default async function checkIfPublicKeyRegisteredWithFortuna(publicKey: string): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const walletExists = await prismaClient.solana_wallet.count({
			where: {
				public_key: publicKey
			}
		})

		return walletExists > 0
	} catch (error) {
		console.error("Error checking if public key registered with fortuna:", error)
		throw error
	}
}
