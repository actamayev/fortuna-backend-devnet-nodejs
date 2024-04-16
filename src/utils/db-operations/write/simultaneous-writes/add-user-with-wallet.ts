import bs58 from "bs58"
import { Keypair } from "@solana/web3.js"
import prismaClient from "../../../../prisma-client"

export default async function createUserWithWallet(
	userFields: NewLocalUserFields,
	keypair: Keypair
): Promise<{ userId: number, publicKey: string }> {
	try {
		const result = await prismaClient.$transaction(async (prisma) => {
			const user = await prisma.credentials.create({
				data: userFields
			})

			const wallet = await prisma.solana_wallet.create({
				data: {
					user_id: user.user_id,
					public_key: keypair.publicKey.toBase58(),
					secret_key: bs58.encode(Buffer.from(keypair.secretKey)),
				}
			})

			return { userId: user.user_id, publicKey: wallet.public_key }
		})

		return result
	} catch (error) {
		console.error(error)
		throw error
	}
}
