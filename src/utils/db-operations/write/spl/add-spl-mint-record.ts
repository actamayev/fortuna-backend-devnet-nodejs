import prismaClient from "../../../../prisma-client"

// eslint-disable-next-line max-params
export default async function addSPLMintRecord (
	splId: number,
	tokenAccountId: number,
	numberOfShares: number,
	splMintFeeSol: number,
	solPriceInUSD: number,
	payerSolanaWalletId: number,
	transactionSignature: string
): Promise<void> {
	try {
		await prismaClient.spl_mint.create({
			data: {
				spl_id: splId,
				token_account_id: tokenAccountId,
				number_of_shares: numberOfShares,
				spl_mint_fee_sol: splMintFeeSol,
				spl_mint_fee_usd: splMintFeeSol * solPriceInUSD,
				payer_solana_wallet_id: payerSolanaWalletId,
				transaction_signature: transactionSignature
			}
		})
	} catch (error) {
		console.error(error)
	}
}
