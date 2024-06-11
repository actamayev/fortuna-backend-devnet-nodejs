import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import { Currencies } from "@prisma/client"
import SecretsManager from "../../../classes/secrets-manager"
import PrismaClientClass from "../../../classes/prisma-client"
import SolPriceManager from "../../../classes/sol-price-manager"

// eslint-disable-next-line max-params
export default async function addSolTransferRecord (
	recipientPublicKey: PublicKey,
	isRecipientFortunaWallet: boolean,
	transactionSignature: string,
	transferDetails: { solToTransfer: number, usdToTransfer: number, defaultCurrency: Currencies },
	transferFeeSol: number,
	senderWalletId: number,
	recipientSolanaWalletId: number | undefined,
	isExclusiveVideoAccessPurchase: boolean,
	feePayerSolanaWalletId?: number
): Promise<AddSolTransferToDB> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		if (_.isUndefined(feePayerSolanaWalletId)) {
			const fortunaFeePayerSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_FEE_PAYER_WALLET_ID_DB")
			feePayerSolanaWalletId = parseInt(fortunaFeePayerSolanaWalletIdDb, 10)
		}
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
