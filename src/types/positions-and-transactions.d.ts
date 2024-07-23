declare global {
	interface RetrievedMyExclusiveContentData {
		created_at: Date
		video: {
			video_name: string
			uuid: string
			uploaded_image: {
				image_url: string
			}
			uploaded_video: {
				video_duration_seconds: number
			}
			video_creator: {
				username: string | null
				profile_picture: {
					image_url: string
				} | null
				channel_name: {
					channel_name: string
				} | null
			}
		}
		exclusive_video_access_purchase_sol_transfer: {
			sol_amount_transferred: number
			usd_amount_transferred: number
			sender_new_wallet_balance_sol: number | null
			sender_new_wallet_balance_usd: number | null
		}
		exclusive_video_access_purchase_fortuna_take: {
			sol_amount_transferred: number
			usd_amount_transferred: number
		}
	}

	interface BasicRetrievedDBTransationListData {
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

	interface OutgoingTransactionListData extends BasicRetrievedDBTransationListData {
		sender_new_wallet_balance_sol: number | null
		sender_new_wallet_balance_usd: number | null
	}

	interface IncomingTransactionListData extends BasicRetrievedDBTransationListData {
		recipient_new_wallet_balance_sol: number | null
		recipient_new_wallet_balance_usd: number | null
	}

	interface MyExclusiveContentData {
		videoName: string
		imageUrl: string
		uuid: string
		videoDurationSeconds: number
		purchaseDate: Date
		priceInSol: number
		priceInUsd: number
		channelName: string
		creatorProfilePictureUrl: string | null
		creatorUsername: string

		newWalletBalanceSol: number | null
		newWalletBalanceUsd: number | null
	}

	interface OutputTransactionData {
		solTransferId: number
		solAmountTransferred: number
		usdAmountTransferred: number
		transferByCurrency: Currencies
		depositOrWithdrawal: "deposit" | "withdrawal"

		transferDateTime: Date
		transferToUsername?: string
		transferToPublicKey?: string
		transferFromUsername: string

		newWalletBalanceSol: number | null
		newWalletBalanceUsd: number | null
	}
}

export {}
