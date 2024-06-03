import { SiteThemes } from "@prisma/client"
import { PublicKey } from "@solana/web3.js"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function addGoogleUserWithWallet(
	encryptedEmail: DeterministicEncryptedString,
	publicKey: PublicKey,
	encryptedSecretKey: NonDeterministicEncryptedString,
	siteTheme: SiteThemes
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const result = await prismaClient.$transaction(async (prisma) => {
			const user = await prisma.credentials.create({
				data: {
					email__encrypted: encryptedEmail,
					auth_method: "google",
					default_site_theme: siteTheme
				}
			})

			await prisma.solana_wallet.create({
				data: {
					user_id: user.user_id,
					public_key: publicKey.toBase58(),
					secret_key__encrypted: encryptedSecretKey,
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
