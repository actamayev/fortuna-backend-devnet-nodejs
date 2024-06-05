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

	interface RetrievedMyOwnershipData {
		number_of_shares: number
		purchase_price_per_share_usd: number
		video: {
			public_key_address: string
			creator_wallet_id: number
			video_name: string
			listing_price_to_access_usd: number
			spl_creator_wallet: {
				user: {
					username: string | null
				}
			}
			uploaded_image: {
				image_url: string
				uuid: string
			}
		}
	}

	interface PurchaseData {
		numberOfShares: number
		purchasePricePerShareUsd: number
	}

	interface MyOwnershipDataInMap {
		purchaseData: PurchaseData[]
		spl: {
			public_key_address: string
			creator_wallet_id: number
			video_name: string
			listing_price_to_access_usd: number
			spl_creator_wallet: {
				user: {
					username: string | null
				}
			}
			uploaded_image: {
				image_url: string
				uuid: string
			}
		}
	}

	type RetrievedMyOwnershipDataMap = Map<string, MyOwnershipDataInMap>

	interface MyOwnershipData {
		splPublicKey: string
		purchaseData: PurchaseData[]
		imageUrl: string
		uuid: string
		isMyContent: boolean
		videoName: string
		creatorUsername: string
		originalListingPricePerShareUsd: number
	}
}

export {}
