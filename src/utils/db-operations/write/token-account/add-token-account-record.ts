import { PublicKey } from "@solana/web3.js"
import { token_account } from "@prisma/client"
import prismaClient from "../../../../prisma-client"

export default async function addTokenAccountRecord (
	splId: number,
	solanaWalletId: number,
	publicKey: PublicKey,
	creationFeeSol: number,
	creationFeeUsd: number,
	payerWalletId: number
): Promise<token_account> {
	try {
		const tokenAccountResponse = await prismaClient.token_account.create({
			data: {
				spl_id: splId,
				parent_solana_wallet_id: solanaWalletId,
				public_key: publicKey.toString(),
				token_account_creation_fee_sol: creationFeeSol,
				token_account_creation_fee_usd: creationFeeUsd,
				fee_payer_solana_wallet_id: payerWalletId
			}
		})

		return tokenAccountResponse
	} catch (error) {
		console.error(error)
		throw error
	}
}
