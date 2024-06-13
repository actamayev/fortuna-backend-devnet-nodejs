import PrismaClientClass from "../../../classes/prisma-client"

export default async function addExclusiveVideoAccessPurchaseTake(
	senderSolanaWalletId: number,
	fortunaRecipientSolanaWalletId: number,
	transactionSignature: string,
	transferDetails: TransferDetailsLessDefaultCurrency,
	blockchainFeesPaidByFortunaId: number
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const fortunaTake = await prismaClient.exclusive_video_access_purchase_fortuna_take.create({
			data: {
				sender_solana_wallet_id: senderSolanaWalletId,
				fortuna_recipient_solana_wallet_id: fortunaRecipientSolanaWalletId,
				transaction_signature: transactionSignature,
				sol_amount_transferred: transferDetails.solToTransfer,
				usd_amount_transferred: transferDetails.usdToTransfer,
				blockchain_fees_paid_by_fortuna_id: blockchainFeesPaidByFortunaId
			}
		})

		return fortunaTake.exclusive_video_access_purchase_fortuna_take_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
