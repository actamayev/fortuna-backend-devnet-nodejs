import SecretsManager from "../../../classes/secrets-manager"
import PrismaClientClass from "../../../classes/prisma-client"
import SolPriceManager from "../../../classes/sol-price-manager"

export default async function addSplMintWithOwnership(
	splId: number,
	tokenAccountId: number,
	numberOfShares: number,
	splMintFeeSol: number,
	transactionSignature: string,
	solanaWalletId: number
): Promise<void> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		const fortunaFeePayerSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_FEE_PAYER_WALLET_ID_DB")
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.$transaction(async (prisma) => {
			await prisma.spl_mint.create({
				data: {
					spl_id: splId,
					token_account_id: tokenAccountId,
					number_of_shares: numberOfShares,
					spl_mint_fee_sol: splMintFeeSol,
					spl_mint_fee_usd: splMintFeeSol * solPriceDetails.price,
					fee_payer_solana_wallet_id: parseInt(fortunaFeePayerSolanaWalletIdDb, 10),
					transaction_signature: transactionSignature
				}
			})

			await prisma.spl_ownership.create({
				data: {
					spl_id: splId,
					solana_wallet_id: solanaWalletId,
					number_of_shares: numberOfShares,
					purchase_price_per_share_usd: 0
				}
			})
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
