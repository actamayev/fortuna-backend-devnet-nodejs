import { PublicKey } from "@solana/web3.js"
import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-params
export default async function addSolTransferRecord (
	recipientPublicKey: PublicKey,
	isRecipientFortunaWallet: boolean,
	transactionSignature: string,
	transferDetails: TransferDetails,
	senderWalletId: number,
	blockchainFeesPaidByFortunaId: number,
	recipientSolanaWalletId: number | undefined
): Promise<AddSolTransferToDB> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.sol_transfer.create({
			data: {
				recipient_public_key: recipientPublicKey.toString(),
				is_recipient_fortuna_wallet: isRecipientFortunaWallet,
				recipient_solana_wallet_id: recipientSolanaWalletId,
				transaction_signature: transactionSignature,
				sol_amount_transferred: transferDetails.solToTransfer,
				usd_amount_transferred: transferDetails.usdToTransfer,
				transfer_by_currency: transferDetails.defaultCurrency,
				sender_solana_wallet_id: senderWalletId,
				blockchain_fees_paid_by_fortuna_id: blockchainFeesPaidByFortunaId
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
