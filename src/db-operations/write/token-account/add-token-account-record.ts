import { PublicKey } from "@solana/web3.js"
import { token_account } from "@prisma/client"
import SecretsManager from "../../../classes/secrets-manager"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function addTokenAccountRecord (
	splId: number,
	parentSolanaWalletId: number,
	tokenAccountPublicKey: PublicKey,
	creationFeeSol: number,
	creationFeeUsd: number
): Promise<token_account> {
	try {
		const fortunaFeePayerSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_FEE_PAYER_WALLET_ID_DB")
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const tokenAccountResponse = await prismaClient.token_account.create({
			data: {
				spl_id: splId,
				public_key: tokenAccountPublicKey.toString(),
				token_account_creation_fee_sol: creationFeeSol,
				token_account_creation_fee_usd: creationFeeUsd,
				fee_payer_solana_wallet_id: parseInt(fortunaFeePayerSolanaWalletIdDb, 10),
				parent_solana_wallet_id: parentSolanaWalletId
			}
		})

		return tokenAccountResponse
	} catch (error) {
		console.error(error)
		throw error
	}
}
