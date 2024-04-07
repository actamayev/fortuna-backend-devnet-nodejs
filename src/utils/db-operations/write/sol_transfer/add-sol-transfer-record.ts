import prismaClient from "../../../../prisma-client"

// eslint-disable-next-line max-params
export default async function addSolTransferRecord (
	recipientPublicKey: string,
	isRecipientFortunaUser: boolean,
	transactionSignature: string,
	solTransferred: number,
	transferFeeSol: number,
	senderWalletId: number,
	payerSolanaWalletId: number,
	solPriceInUSD: number
): Promise<void> {
	try {
		await prismaClient.sol_transfer.create({
			data: {
				recipient_public_key: recipientPublicKey,
				is_recipient_fortuna_user: isRecipientFortunaUser,
				transaction_signature: transactionSignature,
				sol_transferred: solTransferred,
				usd_transferred: solTransferred * solPriceInUSD,
				transfer_fee_sol: transferFeeSol,
				transfer_fee_usd: transferFeeSol * solPriceInUSD,
				sender_wallet_id: senderWalletId,
				payer_solana_wallet_id: payerSolanaWalletId
			}
		})
	} catch (error) {
		console.error(error)
	}
}
