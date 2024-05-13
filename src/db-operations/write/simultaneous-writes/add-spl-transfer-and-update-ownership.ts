import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function addSplTransferRecordAndUpdateOwnership(
	splId: number,
	recipientSolanaWalletId: number,
	senderSolanaWalletId: number,
	isSplPurchase: boolean,
	isSecondaryMarketTransaction: boolean,
	numberSplSharesTransferred: number,
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		// eslint-disable-next-line max-lines-per-function
		const result = await prismaClient.$transaction(async (prisma) => {
			const transferRecordResult = await prisma.spl_transfer.create({
				data: {
					spl_id: splId,
					recipient_solana_wallet_id: recipientSolanaWalletId,
					sender_solana_wallet_id: senderSolanaWalletId,
					is_spl_purchase: isSplPurchase,
					is_secondary_market_transaction: isSecondaryMarketTransaction,
					number_spl_shares_transferred: numberSplSharesTransferred,
				}
			})

			// Adds/updates an ownership record for the user:
			await prisma.spl_ownership.upsert({
				where: {
					spl_id_solana_wallet_id: {  // This matches the unique constraint
						spl_id: splId,
						solana_wallet_id: recipientSolanaWalletId
					}
				},
				update: {
					number_of_shares: {
						increment: numberSplSharesTransferred
					}
				},
				create: {
					spl_id: splId,
					solana_wallet_id: recipientSolanaWalletId,
					number_of_shares: numberSplSharesTransferred
				}
			})


			// Updates the sender's ownership record:
			await prisma.spl_ownership.update({
				where: {
					spl_id_solana_wallet_id: {
						spl_id: splId,
						solana_wallet_id: senderSolanaWalletId
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
