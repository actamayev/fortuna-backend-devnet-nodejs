import { Currencies } from "@prisma/client"

declare global {
	interface TransferSolData {
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
		is_exclusive_video_access_purchase: boolean

		transfer_fee_sol: number
		transfer_fee_usd: number

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
		is_exclusive_video_access_purchase: boolean

		transfer_fee_sol: number
		transfer_fee_usd: number

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
		transferFeeSol?: number
		transferFeeUsd?: number
		createdAt: Date
	}

	interface PurchaseData {
		numberOfShares: number
		purchasePricePerShareUsd: number
	}
}

export {}
