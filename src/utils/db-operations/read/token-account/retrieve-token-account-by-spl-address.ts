import { token_account } from "@prisma/client"
import prismaClient from "../../../../prisma-client"

export default async function retrieveTokenAccountBySplAddress(
	splAddress: string,
	userPublicKey: string
): Promise<token_account | null> {
	try {
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
