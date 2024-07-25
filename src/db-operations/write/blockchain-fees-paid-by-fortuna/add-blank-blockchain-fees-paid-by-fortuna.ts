import SecretsManager from "../../../classes/secrets-manager"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function addBlankBlockchainFeesPaidByFortuna (): Promise<number> {
	try {
		const fortunaFeePayerSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_FEE_PAYER_WALLET_ID_DB")
		const feePayerSolanaWalletId = parseInt(fortunaFeePayerSolanaWalletIdDb, 10)

		const prismaClient = await PrismaClientClass.getPrismaClient()
		const blankBlockchainFeesPaidByFortunaRecord = await prismaClient.blockchain_fees_paid_by_fortuna.create({
			data: {
				fee_payer_solana_wallet_id: feePayerSolanaWalletId
			}
		})

		return blankBlockchainFeesPaidByFortunaRecord.blockchain_fees_paid_by_fortuna_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
