import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function, max-params
export default async function addSplTransferRecordAndUpdateOwnership(
	splId: number,
	recipientSolanaWalletId: number,
	senderSolanaWalletId: number,
	isSplPurchase: boolean,
	isSecondaryMarketTransaction: boolean,
	numberSplSharesTransferred: number,
	transferPricePerShareUsd: number,
	splOwnershipIdToDecrementFrom: number
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		// eslint-disable-next-line max-lines-per-function
		const splTransferId = await prismaClient.$transaction(async (prisma) => {
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
			await prisma.spl_ownership.create({
				data: {
					spl_id: splId,
					solana_wallet_id: recipientSolanaWalletId,
					number_of_shares: numberSplSharesTransferred,
					purchase_price_per_share_usd: transferPricePerShareUsd
				}
			})

			// Updates the sender's ownership record:
			await prisma.spl_ownership.update({
				where: {
					spl_ownership_id: splOwnershipIdToDecrementFrom
				},
				data: {
					number_of_shares: {
						increment: -numberSplSharesTransferred
					}
				}
			})

			return transferRecordResult.spl_transfer_id
		})

		return splTransferId
	} catch (error) {
		console.error(error)
		throw error
	}
}
