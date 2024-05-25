import { PublicKey } from "@solana/web3.js"
import { Currencies, SPLListingStatus } from "@prisma/client"

declare global {
	interface CreateSPLResponse {
		mint: PublicKey
		metadataTransactionSignature: string
		feeInSol: number
	}

	interface SPLDataSavedToS3 {
		splName: string
		numberOfShares: number
		creatorOwnershipPercentage: number
		listingSharePriceUsd: number
		imageUrl: string
		videoUrl: string | undefined
		description: string
		originalContentUrl: string
		isContentExclusive: boolean
		valueNeededToAccessExclusiveContentUsd?: number
		listingPriceToAccessExclusiveContentUsd?: number
		allowValueFromSameCreatorTokensForExclusiveContent?: boolean
	}

	interface IncomingNewSPLData extends SPLDataSavedToS3 {
		uuid: string
		uploadedImageId: number
		uploadedVideoId: number
	}

	interface RetrievedDBSplData {
		spl_id: number
		spl_name: string
		total_number_of_shares: number
		listing_price_per_share_usd: number
		spl_listing_status: SPLListingStatus
		description: string
		initial_creator_ownership_percentage: number
		uploaded_image: { image_url: string }
		uploaded_video: { uuid: string }
		public_key_address: string
	}

	interface OutputSplData {
		splId: number
		splName: string
		numberOfShares: number
		listingSharePriceUsd: number
		splListingStatus: SPLListingStatus
		description: string
		creatorOwnershipPercentage: number
		imageUrl: string
		uuid: string
		mintAddress: string
	}

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
		is_spl_purchase: boolean

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
		is_spl_purchase: boolean

		transfer_fee_sol: number
		transfer_fee_usd: number

		created_at: Date
		username?: string
	}

	interface SplDataNeededToCheckForExclusiveContentAccess {
		spl: {
			spl_id: number
			public_key_address: string
			listing_price_per_share_usd: number
			creator_wallet_id: number
			original_content_url: string
			is_spl_exclusive: boolean
			value_needed_to_access_exclusive_content_usd: number | null
			allow_value_from_same_creator_tokens_for_exclusive_content: boolean | null
		}
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

	interface RetrievedSplByPublicKeyData {
		spl_name: string
		spl_id: number
		public_key_address: string
		total_number_of_shares: number
		listing_price_per_share_usd: number
		spl_listing_status: SPLListingStatus
		creator_wallet_id: number
		uploaded_image: {
			uuid: string
			image_url: string
		}
	}

	interface SplByPublicKeyData {
		splName: string
		splId: number
		publicKeyAddress: string
		listingSharePriceUsd: number
		splListingStatus: SPLListingStatus
		totalNumberOfShares: number
		creatorWalletId: number
		imageUrl: string
		uuid: string
	}

	interface RetrievedMyOwnershipData {
		number_of_shares: number
		purchase_price_per_share_usd: number
		spl: {
			public_key_address: string
			creator_wallet_id: number
			spl_name: string
			uploaded_image: {
				image_url: string
				uuid: string
			}
		}
	}

	interface RetrievedMyExclusiveContentData {
		spl: {
			spl_name: string
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
			spl_name: string
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
		splName: string
	}

	interface MyExclusiveContentData {
		splName: string
		imageUrl: string
		uuid: string
	}
}

export {}
