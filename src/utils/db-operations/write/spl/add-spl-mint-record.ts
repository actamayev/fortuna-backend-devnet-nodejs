import prismaClient from "../../../../prisma-client"
import SolPriceManager from "../../../../classes/sol-price-manager"

export default async function addSPLMintRecord (
	splId: number,
	tokenAccountId: number,
	numberOfShares: number,
	splMintFeeSol: number,
	payerSolanaWalletId: number,
	transactionSignature: string
): Promise<void> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		await prismaClient.spl_mint.create({
			data: {
				spl_id: splId,
				token_account_id: tokenAccountId,
				number_of_shares: numberOfShares,
				spl_mint_fee_sol: splMintFeeSol,
				spl_mint_fee_usd: splMintFeeSol * solPriceDetails.price,
				fee_payer_solana_wallet_id: payerSolanaWalletId,
				transaction_signature: transactionSignature
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
