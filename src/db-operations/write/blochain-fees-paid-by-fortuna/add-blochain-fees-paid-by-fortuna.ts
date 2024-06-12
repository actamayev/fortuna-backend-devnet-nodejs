import _ from "lodash"
import SecretsManager from "../../../classes/secrets-manager"
import PrismaClientClass from "../../../classes/prisma-client"
import SolPriceManager from "../../../classes/sol-price-manager"

export default async function addBlockchainFeesPaidByFortuna (
	transferFeeSol: number,
	feePayerSolanaWalletId?: number
): Promise<number> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		if (_.isUndefined(feePayerSolanaWalletId)) {
			const fortunaFeePayerSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_FEE_PAYER_WALLET_ID_DB")
			feePayerSolanaWalletId = parseInt(fortunaFeePayerSolanaWalletIdDb, 10)
		}
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const blockchainFeesPaidByFortuna = await prismaClient.blockchain_fees_paid_by_fortuna.create({
			data: {
				fee_in_sol: transferFeeSol,
				fee_in_usd: transferFeeSol * solPriceDetails.price,
				fee_payer_solana_wallet_id: feePayerSolanaWalletId
			}
		})

		return blockchainFeesPaidByFortuna.blockchain_fees_paid_by_fortuna_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
