import prismaClient from "../../../../classes/prisma-client"

export default async function checkIfPublicKeyRegisteredWithFortuna(publicKey: string): Promise<boolean> {
	try {
		const wallet = await prismaClient.solana_wallet.findFirst({
			where: {
				public_key: {
					equals: publicKey
				}
			},
			select: {
				public_key: true
			}
		})

		return !!wallet
	} catch (error) {
		console.error("Error checking if public key registered with fortuna:", error)
		throw error
	}
}
