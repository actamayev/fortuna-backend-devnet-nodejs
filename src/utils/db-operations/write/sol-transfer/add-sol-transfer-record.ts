import prismaClient from "../../../../prisma-client"
import SolPriceManager from "../../../../classes/sol-price-manager"

// eslint-disable-next-line max-params
export default async function addSolTransferRecord (
	recipientPublicKey: string,
	isRecipientFortunaWallet: boolean,
	transactionSignature: string,
	transferAmountSol: number,
	transferFeeSol: number,
	senderWalletId: number,
	recipientSolanaWalletId: number | undefined,
	isSplPurchase: boolean,
	feePayerSolanaWalletId: number = Number(process.env.FORTUNA_SOLANA_WALLET_ID_DB)
): Promise<AddSolTransferToDB> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		const solTransfer = await prismaClient.sol_transfer.create({
			data: {
				recipient_public_key: recipientPublicKey,
				is_recipient_fortuna_wallet: isRecipientFortunaWallet,
				recipient_solana_wallet_id: recipientSolanaWalletId,
				transaction_signature: transactionSignature,
				sol_amount_transferred: transferAmountSol,
				usd_amount_transferred: transferAmountSol * solPriceDetails.price,
				is_spl_purchase: isSplPurchase,
				transfer_fee_sol: transferFeeSol,
				transfer_fee_usd: transferFeeSol * solPriceDetails.price,
				sender_solana_wallet_id: senderWalletId,
				fee_payer_solana_wallet_id: feePayerSolanaWalletId
			}
		})

		return solTransfer
	} catch (error) {
		console.error(error)
		throw error
	}
}
