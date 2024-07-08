import { PublicKey } from "@solana/web3.js"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function addUserWithWalletWithChannelName(
	userFields: NewLocalUserFields,
	publicKey: PublicKey,
	encryptedSecretKey: NonDeterministicEncryptedString
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.$transaction(async (prisma) => {
			const user = await prisma.credentials.create({
				data: userFields
			})

			await prisma.solana_wallet.create({
				data: {
					user_id: user.user_id,
					public_key: publicKey.toBase58(),
					secret_key__encrypted: encryptedSecretKey
				}
			})

			await prisma.channel_name.create({
				data: {
					user_id: user.user_id,
					channel_name: userFields.username
				}
			})

			return user.user_id
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
