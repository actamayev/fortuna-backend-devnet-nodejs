import prismaClient from "../../../../prisma-client"
import SolPriceManager from "../../../../classes/sol-price-manager"

// eslint-disable-next-line max-params
export default async function addSplTransferRecord(
	splId: number,
	transactionSignature: string,
	recipientSolanaWalletId: number,
	recipientTokenAccountId: number,
	senderSolanaWalletId: number,
	senderTokenAccountId: number,
	isSplPurchase: boolean,
	numberSplSharesTransferred: number,
	transferFeeSol: number,
	feePayerSolanaWalletId: number = Number(process.env.FORTUNA_SOLANA_WALLET_ID_DB)
): Promise<number> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		const splTransfer = await prismaClient.spl_transfer.create({
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

		return splTransfer.spl_transfer_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
