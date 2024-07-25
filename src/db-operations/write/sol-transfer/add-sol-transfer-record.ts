import { PublicKey } from "@solana/web3.js"
import PrismaClientClass from "../../../classes/prisma-client"
import { getWalletBalanceWithUSD } from "../../../utils/solana/get-wallet-balance"

// eslint-disable-next-line max-params
export default async function addSolTransferRecord (
	recipientPublicKey: PublicKey,
	isRecipientFortunaWallet: boolean,
	transactionSignature: string,
	transferDetails: TransferDetails,
	senderSolanaWallet: ExtendedSolanaWallet,
	recipientSolanaWalletId: number | undefined,
	blockchainFeesPaidByUserId: number | undefined,
	blockchainFeesPaidByFortunaId: number | undefined
): Promise<AddSolTransferToDB> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const senderWalletBalanceAfterTransfer = await getWalletBalanceWithUSD(new PublicKey(senderSolanaWallet.public_key))
		const recipientWalletBalanceAfterTransfer = await getWalletBalanceWithUSD(recipientPublicKey)

		return await prismaClient.sol_transfer.create({
			data: {
				recipient_public_key: recipientPublicKey.toString(),
				is_recipient_fortuna_wallet: isRecipientFortunaWallet,
				recipient_solana_wallet_id: recipientSolanaWalletId,
				transaction_signature: transactionSignature,
				sol_amount_transferred: transferDetails.solToTransfer,
				usd_amount_transferred: transferDetails.usdToTransfer,
				transfer_by_currency: transferDetails.defaultCurrency,
				sender_solana_wallet_id: senderSolanaWallet.solana_wallet_id,

				blockchain_fees_paid_by_fortuna_id: blockchainFeesPaidByFortunaId,
				blockchain_fees_paid_by_user_id: blockchainFeesPaidByUserId,

				sender_new_wallet_balance_sol: senderWalletBalanceAfterTransfer.balanceInSol,
				sender_new_wallet_balance_usd: senderWalletBalanceAfterTransfer.balanceInUsd,
				recipient_new_wallet_balance_sol: recipientWalletBalanceAfterTransfer.balanceInSol,
				recipient_new_wallet_balance_usd: recipientWalletBalanceAfterTransfer.balanceInUsd
			}
		}) as AddSolTransferToDB // This is done to assert that the new wallet balance fields are not
	} catch (error) {
		console.error(error)
		throw error
	}
}
