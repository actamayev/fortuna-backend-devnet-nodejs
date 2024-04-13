import { PublicKey } from "@solana/web3.js"
import prismaClient from "../../../../prisma-client"

export default async function addTokenAccountRecord (
	splId: number,
	solanaWalletId: number,
	publicKey: PublicKey,
	creationFeeSol: number,
	creationFeeUsd: number,
	payerWalletId: number
): Promise<number | void> {
	try {
		const tokenAccountResponse = await prismaClient.token_account.create({
			data: {
				spl_id: splId,
				parent_solana_wallet_id: solanaWalletId,
				public_key: publicKey.toString(),
				token_account_creation_fee_sol: creationFeeSol,
				token_account_creation_fee_usd: creationFeeUsd,
				payer_solana_wallet_id: payerWalletId
			}
		})

		return tokenAccountResponse.token_account_id
	} catch (error) {
		console.error(error)
	}
}
