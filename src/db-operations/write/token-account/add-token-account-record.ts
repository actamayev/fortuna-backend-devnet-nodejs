import { PublicKey } from "@solana/web3.js"
import { token_account } from "@prisma/client"
import SecretsManager from "../../../classes/secrets-manager"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function addTokenAccountRecord (
	splId: number,
	solanaWalletId: number,
	publicKey: PublicKey,
	creationFeeSol: number,
	creationFeeUsd: number
): Promise<token_account> {
	try {
		const fortunaSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_SOLANA_WALLET_ID_DB")
		const feePayerSolanaWalletId = parseInt(fortunaSolanaWalletIdDb, 10)
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const tokenAccountResponse = await prismaClient.token_account.create({
			data: {
				spl_id: splId,
				parent_solana_wallet_id: solanaWalletId,
				public_key: publicKey.toString(),
				token_account_creation_fee_sol: creationFeeSol,
				token_account_creation_fee_usd: creationFeeUsd,
				fee_payer_solana_wallet_id: feePayerSolanaWalletId
			}
		})

		return tokenAccountResponse
	} catch (error) {
		console.error(error)
		throw error
	}
}
