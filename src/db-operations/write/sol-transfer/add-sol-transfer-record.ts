import { PublicKey } from "@solana/web3.js"
import { Currencies } from "@prisma/client"
import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-params
export default async function addSolTransferRecord (
	recipientPublicKey: PublicKey,
	isRecipientFortunaWallet: boolean,
	transactionSignature: string,
	transferDetails: { solToTransfer: number, usdToTransfer: number, defaultCurrency: Currencies },
	senderWalletId: number,
	recipientSolanaWalletId: number | undefined,
	blockchainFeesPaidByFortunaId: number,
	isExclusiveVideoAccessPurchase: boolean = false
): Promise<AddSolTransferToDB> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const solTransfer = await prismaClient.sol_transfer.create({
			data: {
				recipient_public_key: recipientPublicKey.toString(),
				is_recipient_fortuna_wallet: isRecipientFortunaWallet,
				recipient_solana_wallet_id: recipientSolanaWalletId,
				transaction_signature: transactionSignature,
				sol_amount_transferred: transferDetails.solToTransfer,
				usd_amount_transferred: transferDetails.usdToTransfer,
				transfer_by_currency: transferDetails.defaultCurrency,
				is_exclusive_video_access_purchase: isExclusiveVideoAccessPurchase,
				sender_solana_wallet_id: senderWalletId,
				blockchain_fees_paid_by_fortuna_id: blockchainFeesPaidByFortunaId
			}
		})

		return solTransfer
	} catch (error) {
		console.error(error)
		throw error
	}
}
