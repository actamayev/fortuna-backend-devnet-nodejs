import { Currencies } from "@prisma/client"
import { PublicKey } from "@solana/web3.js"

declare global {
	interface MoneyTransferData {
		sendingTo: string
		transferAmount: number
		transferCurrency: Currencies
	}

	interface RetrievedDBTransactionListData {
		sol_transfer_id: number
		recipient_public_key?: string
		is_recipient_fortuna_wallet: boolean

		sol_amount_transferred: number
		usd_amount_transferred: number
		transfer_by_currency: Currencies

		created_at: Date
		recipient_username?: string
		sender_username: string
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
	}

	interface OutputTransactionData {
		solTransferId: number
		solAmountTransferred: number
		usdAmountTransferred: number
		transferByCurrency: Currencies
		outgoingOrIncoming: "outgoing" | "incoming"

		transferDateTime: Date
		transferToUsername?: string
		transferToPublicKey?: string
		transferFromUsername: string
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
