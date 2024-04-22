import { PublicKey } from "@solana/web3.js"

declare global {
	interface CreateSPLResponse {
		mint: PublicKey
		metadataTransactionSignature: string
		feeInSol: number
	}

	interface SLPDataSavedToS3 {
		splName: string
		numberOfShares: number
		creatorOwnershipPercentage: number
		offeringSharePriceSol: number
		offeringSharePriceUsd: number
		imageUrl: string
		videoUrl: string
		description: string
	}

	interface IncomingNewSPLData extends SLPDataSavedToS3 {
		uuid: string
		uploadedImageId: number
		uploadedVideoId: number
	}

	interface RetrievedDBSplData {
		spl_id: number
		spl_name: string
		total_number_of_shares: number
		listing_price_per_share_sol: number
		listing_price_per_share_usd: number
		description: string
		initial_creator_ownership_percentage: number
		uploaded_image: { image_url: string }
		uploaded_video: { video_url: string, uuid: string }
		public_key_address: string
	}

	interface OutputSplData {
		splId: number
		splName: string
		numberOfShares: number
		offeringSharePriceSol: number
		offeringSharePriceUsd: number
		description: string
		creatorOwnershipPercentage: number
		imageUrl: string
		videoUrl: string
		uuid: string
		mintAddress: string
	}

	interface TransferSolData {
		sendingTo: string
		transferAmountSol: number
	}

	interface RetrievedDBTransactionListData {
		sol_transfer_id: number
		recipient_public_key?: string
		is_recipient_fortuna_wallet: boolean

		sol_amount_transferred: number
		usd_amount_transferred: number
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

		transfer_fee_sol: number
		transfer_fee_usd: number
		is_spl_purchase: boolean

		created_at: Date
		username?: string
	}

	interface OutputTransactionData {
		solTransferId: number
		solAmountTransferred: number
		usdAmountTransferred: number
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
		listing_price_per_share_sol: number
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
		listingPricePerShareSol: number
		totalNumberOfShares: number
		creatorWalletId: number
		imageUrl: string
		uuid: string
	}

	interface PurchaseSPLTokensData {
		numberOfTokensPurchasing: number
		splPublicKey: string
	}

	interface RetrievedMyOwnershipData {
		number_of_shares: number
		spl: {
			public_key_address: string
			creator_wallet_id: number
			spl_name: string
			uploaded_image: {
				image_url: string
				uuid: string
			},
		}
	}

	interface MyOwnershipData {
		splPublicKey: string
		numberOfShares: number
		imageUrl: string
		uuid: string
		isMyContent: boolean
		splName: string
	}
}

export {}
