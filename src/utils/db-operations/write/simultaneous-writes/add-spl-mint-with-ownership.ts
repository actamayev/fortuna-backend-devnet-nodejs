import prismaClient from "../../../../prisma-client"
import SecretsManager from "../../../../classes/secrets-manager"
import SolPriceManager from "../../../../classes/sol-price-manager"

export default async function addSplMintWithOwnership(
	splId: number,
	tokenAccountId: number,
	numberOfShares: number,
	splMintFeeSol: number,
	transactionSignature: string
): Promise<void> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		const fortunaSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_SOLANA_WALLET_ID_DB")
		const feePayerSolanaWalletId = parseInt(fortunaSolanaWalletIdDb, 10)

		await prismaClient.$transaction(async (prisma) => {
			await prisma.spl_mint.create({
				data: {
					spl_id: splId,
					token_account_id: tokenAccountId,
					number_of_shares: numberOfShares,
					spl_mint_fee_sol: splMintFeeSol,
					spl_mint_fee_usd: splMintFeeSol * solPriceDetails.price,
					fee_payer_solana_wallet_id: feePayerSolanaWalletId,
					transaction_signature: transactionSignature
				}
			})

			await prisma.spl_ownership.create({
				data: {
					spl_id: splId,
					token_account_id: tokenAccountId,
					number_of_shares: numberOfShares
				}
			})
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
