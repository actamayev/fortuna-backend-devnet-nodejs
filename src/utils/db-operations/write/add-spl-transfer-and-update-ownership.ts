import SolPriceManager from "../../../classes/sol-price-manager"
import prismaClient from "../../../prisma-client"

// eslint-disable-next-line max-params, max-lines-per-function
export default async function addSplTransferRecordAndUpdateOwnership(
	splId: number,
	transactionSignature: string,
	recipientSolanaWalletId: number,
	recipientTokenAccountId: number,
	senderSolanaWalletId: number,
	senderTokenAccountId: number,
	isSplPurchase: boolean,
	numberSplSharesTransferred: number,
	transferFeeSol: number,
	userHasExistingTokenAccount: boolean,
	feePayerSolanaWalletId: number = Number(process.env.FORTUNA_SOLANA_WALLET_ID_DB)
): Promise<number> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		// eslint-disable-next-line max-lines-per-function
		const result = await prismaClient.$transaction(async (prisma) => {
			const transferRecordResult = await prisma.spl_transfer.create({
				data: {
					spl_id: splId,
					transaction_signature: transactionSignature,
					recipient_solana_wallet_id: recipientSolanaWalletId,
					recipient_token_account_id: recipientTokenAccountId,
					sender_solana_wallet_id: senderSolanaWalletId,
					sender_token_account_id: senderTokenAccountId,
					is_spl_purchase: isSplPurchase,
					number_spl_shares_transferred: numberSplSharesTransferred,
					transfer_fee_sol: transferFeeSol,
					transfer_fee_usd: transferFeeSol * solPriceDetails.price,
					fee_payer_solana_wallet_id: feePayerSolanaWalletId
				}
			})

			// Adds/updates an ownership record for the user:
			if (userHasExistingTokenAccount === true) {
				await prisma.spl_ownership.update({
					where: {
						spl_id_token_account_id: {
							spl_id: splId,
							token_account_id: recipientTokenAccountId
						}
					},
					data: {
						number_of_shares: {
							increment: numberSplSharesTransferred
						}
					}
				})
			} else {
				await prisma.spl_ownership.create({
					data: {
						spl_id: splId,
						token_account_id: recipientTokenAccountId,
						number_of_shares: numberSplSharesTransferred
					}
				})
			}

			// Updates the sender's ownership record:
			await prisma.spl_ownership.update({
				where: {
					spl_id_token_account_id: {
						spl_id: splId,
						token_account_id: senderTokenAccountId
					}
				},
				data: {
					number_of_shares: {
						increment: -numberSplSharesTransferred
					}
				}
			})

			return { splTransferId: transferRecordResult.spl_transfer_id }
		})

		return result.splTransferId
	} catch (error) {
		console.error(error)
		throw error
	}
}
