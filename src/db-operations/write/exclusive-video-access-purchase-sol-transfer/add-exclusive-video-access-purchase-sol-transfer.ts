import PrismaClientClass from "../../../classes/prisma-client"

export default async function addExclusiveVideoAccessPurchaseSolTransfer (
	fanSolanaWalletId: number,
	contentCreatorSolanaWalletId: number,
	transactionSignature: string,
	transferDetails: TransferDetailsLessDefaultCurrency,
	blockchainFeesPaidByFortunaId: number
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const exclusiveVideoAccessPurchaseSolTransfer = await prismaClient.exclusive_video_access_purchase_sol_transfer.create({
			data: {
				fan_solana_wallet_id: fanSolanaWalletId,
				content_creator_solana_wallet_id: contentCreatorSolanaWalletId,
				transaction_signature: transactionSignature,
				sol_amount_transferred: transferDetails.solToTransfer,
				usd_amount_transferred: transferDetails.usdToTransfer,
				blockchain_fees_paid_by_fortuna_id: blockchainFeesPaidByFortunaId
			}
		})

		return exclusiveVideoAccessPurchaseSolTransfer.exclusive_video_access_purchase_sol_transfer_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
