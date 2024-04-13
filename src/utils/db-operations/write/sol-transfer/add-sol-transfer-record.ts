import prismaClient from "../../../../prisma-client"
import SolPriceManager from "../../../../classes/sol-price-manager"

// eslint-disable-next-line max-params
export default async function addSolTransferRecord (
	recipientPublicKey: string,
	isRecipientFortunaWallet: boolean,
	transactionSignature: string,
	transferData: TransferSolData,
	transferFeeSol: number,
	senderWalletId: number,
	payerSolanaWalletId: number,
	recipientSolanaWalletId: number | undefined
): Promise<AddSolTransferToDB> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		const solTransfer = await prismaClient.sol_transfer.create({
			data: {
				recipient_public_key: recipientPublicKey,
				is_recipient_fortuna_wallet: isRecipientFortunaWallet,
				recipient_solana_wallet_id: recipientSolanaWalletId,
				transaction_signature: transactionSignature,
				sol_transferred: transferData.transferAmountSol,
				usd_transferred: transferData.transferAmountSol * solPriceDetails.price,
				transfer_fee_sol: transferFeeSol,
				transfer_fee_usd: transferFeeSol * solPriceDetails.price,
				sender_solana_wallet_id: senderWalletId,
				payer_solana_wallet_id: payerSolanaWalletId
			}
		})

		return solTransfer
	} catch (error) {
		console.error(error)
		throw error
	}
}
