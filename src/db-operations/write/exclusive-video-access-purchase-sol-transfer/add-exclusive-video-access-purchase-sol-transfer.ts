import { PublicKey } from "@solana/web3.js"
import { exclusive_video_access_purchase_sol_transfer } from "@prisma/client"
import PrismaClientClass from "../../../classes/prisma-client"
import { getWalletBalanceWithUSD } from "../../../utils/solana/get-wallet-balance"

export default async function addExclusiveVideoAccessPurchaseSolTransfer (
	fanSolanaWallet: ExtendedSolanaWallet,
	contentCreatorSolanaWalletId: CreatorWalletDataLessSecretKey,
	transactionSignature: string,
	transferDetails: TransferDetailsLessDefaultCurrency,
	blockchainFeesPaidByFortunaId: number
): Promise<exclusive_video_access_purchase_sol_transfer> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const senderWalletBalanceAfterTransfer = await getWalletBalanceWithUSD(new PublicKey(fanSolanaWallet.public_key))
		const recipientWalletBalanceAfterTransfer = await getWalletBalanceWithUSD(contentCreatorSolanaWalletId.public_key)

		return await prismaClient.exclusive_video_access_purchase_sol_transfer.create({
			data: {
				fan_solana_wallet_id: fanSolanaWallet.solana_wallet_id,
				content_creator_solana_wallet_id: contentCreatorSolanaWalletId.solana_wallet_id,
				transaction_signature: transactionSignature,
				sol_amount_transferred: transferDetails.solToTransfer,
				usd_amount_transferred: transferDetails.usdToTransfer,
				blockchain_fees_paid_by_fortuna_id: blockchainFeesPaidByFortunaId,

				sender_new_wallet_balance_sol: senderWalletBalanceAfterTransfer.balanceInSol,
				sender_new_wallet_balance_usd: senderWalletBalanceAfterTransfer.balanceInUsd,
				recipient_new_wallet_balance_sol: recipientWalletBalanceAfterTransfer.balanceInSol,
				recipient_new_wallet_balance_usd: recipientWalletBalanceAfterTransfer.balanceInUsd
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
