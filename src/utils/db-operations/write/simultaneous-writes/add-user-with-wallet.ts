import bs58 from "bs58"
import { Keypair } from "@solana/web3.js"
import Encryptor from "../../../../classes/encrypt"
import PrismaClientClass from "../../../../classes/prisma-client"

export default async function addUserWithWallet(
	userFields: NewLocalUserFields,
	keypair: Keypair
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const result = await prismaClient.$transaction(async (prisma) => {
			const user = await prisma.credentials.create({
				data: userFields
			})

			const encryptor = new Encryptor()
			const encryptedSecretKey = await encryptor.encrypt(bs58.encode(Buffer.from(keypair.secretKey)))

			await prisma.solana_wallet.create({
				data: {
					user_id: user.user_id,
					public_key: keypair.publicKey.toBase58(),
					secret_key: encryptedSecretKey,
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
