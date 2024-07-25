import { Currencies } from "@prisma/client"
import { PublicKey } from "@solana/web3.js"

declare global {
	interface MoneyTransferData {
		sendingTo: string
		transferAmount: number
		transferCurrency: Currencies
	}

	interface AddSolTransferToDB {
		sol_transfer_id: number
		recipient_public_key: string
		is_recipient_fortuna_wallet: boolean

		sol_amount_transferred: number
		usd_amount_transferred: number
		transfer_by_currency: Currencies

		created_at: Date
		username?: string

		transaction_signature: string

		sender_new_wallet_balance_sol: number
		sender_new_wallet_balance_usd: number
		recipient_new_wallet_balance_sol: number
		recipient_new_wallet_balance_usd: number
	}

	interface TransferDetailsLessDefaultCurrency {
		solToTransfer: number
		usdToTransfer: number
	}

	interface TransferDetails extends TransferDetailsLessDefaultCurrency {
		defaultCurrency: Currencies
	}

	interface CreatorWalletDataLessSecretKey {
		public_key: PublicKey
		solana_wallet_id: number
	}

	interface CreatorWalletData extends CreatorWalletDataLessSecretKey {
		secret_key__encrypted: NonDeterministicEncryptedString
	}
}

export {}
