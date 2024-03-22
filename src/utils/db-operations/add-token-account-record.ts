import { token_account } from "@prisma/client"
import prismaClient from "../../prisma-client"

export default async function addTokenAccountRecord (splId: number, solanaWalletId: number): Promise<token_account | void> {
	try {
		const tokenAccountResponse = await prismaClient.token_account.create({
			data: {
				spl_id: splId,
				solana_wallet_id: solanaWalletId
			}
		})

		return tokenAccountResponse
	} catch (error) {
		console.error(error)
	}
}
