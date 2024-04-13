import prismaClient from "../../../../prisma-client"

// eslint-disable-next-line max-params
export default async function addSolTransferRecord (
	recipientPublicKey: string,
	isRecipientFortunaWallet: boolean,
	transactionSignature: string,
	transferData: TransferSolData,
	transferFeeSol: number,
	senderWalletId: number,
	payerSolanaWalletId: number,
	recipientSolanaWalletId: number | undefined,
	solPriceInUSD: number
): Promise<AddSolTransferToDB | undefined> {
	try {
		const solTransferData = {
			recipient_public_key: recipientPublicKey,
			is_recipient_fortuna_wallet: isRecipientFortunaWallet,
			recipient_solana_wallet_id: recipientSolanaWalletId,
			transaction_signature: transactionSignature,
			sol_transferred: transferData.transferAmountSol,
			usd_transferred: transferData.transferAmountSol * solPriceInUSD,
			transfer_fee_sol: transferFeeSol,
			transfer_fee_usd: transferFeeSol * solPriceInUSD,
			sender_solana_wallet_id: senderWalletId,
			payer_solana_wallet_id: payerSolanaWalletId
		}
		const solTransfer = await prismaClient.sol_transfer.create({
			data: solTransferData
		})

		return solTransfer
	} catch (error) {
		console.error(error)
	}
}
