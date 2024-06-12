import PrismaClientClass from "../../../classes/prisma-client"

export default async function addExclusiveVideoAccessPurchaseTake(
	senderSolanaWalletId: number,
	fortunaRecipientSolanaWalletId: number,
	transactionSignature: string,
	transferDetails: TransferDetailsLessDefaultCurrency,
	exclusiveVideoAccessPurchaseId: number,
	blockchainFeesPaidByFortunaId: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.exclusive_video_access_purchase_fortuna_take.create({
			data: {
				sender_solana_wallet_id: senderSolanaWalletId,
				fortuna_recipient_solana_wallet_id: fortunaRecipientSolanaWalletId,
				transaction_signature: transactionSignature,
				sol_amount_transferred: transferDetails.solToTransfer,
				usd_amount_transferred: transferDetails.usdToTransfer,
				exclusive_video_access_purchase_id: exclusiveVideoAccessPurchaseId,
				blockchain_fees_paid_by_fortuna_id: blockchainFeesPaidByFortunaId
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
