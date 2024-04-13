import prismaClient from "../../../../prisma-client"

export default async function checkIfPublicKeyRegisteredWithFortuna(publicKey: string): Promise<boolean | void> {
	try {
		const count = await prismaClient.solana_wallet.count({
			where: {
				public_key: {
					equals: publicKey,
					mode: "insensitive"
				},
				network_type: {
					equals: "devnet"
				}
			}
		})

		return count > 0
	} catch (error) {
		console.error("Error checking if public key registered with fortuna:", error)
	}
}
