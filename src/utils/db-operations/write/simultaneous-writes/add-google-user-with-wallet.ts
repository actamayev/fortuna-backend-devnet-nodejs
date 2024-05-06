import bs58 from "bs58"
import { Keypair } from "@solana/web3.js"
import prismaClient from "../../../../classes/prisma-client"

export default async function addGoogleUserWithWallet(
	email: string,
	keypair: Keypair
): Promise<number> {
	try {
		const result = await prismaClient.$transaction(async (prisma) => {
			const user = await prisma.credentials.create({
				data: {
					email,
					auth_method: "google"
				}
			})

			await prisma.solana_wallet.create({
				data: {
					user_id: user.user_id,
					public_key: keypair.publicKey.toBase58(),
					secret_key: bs58.encode(Buffer.from(keypair.secretKey)),
				}
			})

			return user.user_id
		})

		return result
	} catch (error) {
		console.error(error)
		throw error
	}
}
