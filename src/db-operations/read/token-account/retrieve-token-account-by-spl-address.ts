import { token_account } from "@prisma/client"
import PrismaClientClass from "../../../classes/prisma-client"

//TODO: Go through all db-operations files. any place that accepts a publicKey as a parameter should be of type PublicKey
export default async function retrieveTokenAccountBySplAddress(
	splAddress: string,
	userPublicKey: string
): Promise<token_account | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const tokenAccount = await prismaClient.token_account.findFirst({
			where: {
				spl: {
					public_key_address: splAddress
				},
				parent_solana_wallet: {
					public_key: userPublicKey
				}
			}
		})

		return tokenAccount
	} catch (error) {
		console.error(error)
		throw error
	}
}
