import { SPLListingStatus } from "@prisma/client"

declare global {
	interface HomePageVideoRetrievedFromDBByUUID {
		created_at: Date
		uuid: string
		videoUrl?: string
		spl: {
			spl_name: string
			listing_price_per_share_usd: number
			spl_listing_status: SPLListingStatus
			description: string
			total_number_of_shares: number
			public_key_address: string
			original_content_url: string
			is_spl_exclusive: boolean
			creator_wallet_id: number
			spl_id: number
			value_needed_to_access_exclusive_content_usd: number | null
			is_content_instantly_accessible: boolean | null
			instant_access_price_to_exclusive_content_usd: number | null
			allow_value_from_same_creator_tokens_for_exclusive_content: boolean | null
			uploaded_image: {
				image_url: string
			}
			spl_creator_wallet: {
				user: {
					username: string
					profile_picture: {
						image_url: string
					} | null
				}
			}
		}
	}

	interface RetrievedHomePageVideo {
		spl_name: string
		public_key_address: string
		listing_price_per_share_usd: number
		spl_listing_status: SPLListingStatus
		total_number_of_shares: number
		description: string
		original_content_url: string
		is_spl_exclusive: boolean
		creator_wallet_id: number
		spl_id: number
		value_needed_to_access_exclusive_content_usd: number | null
		is_content_instantly_accessible: boolean | null
		instant_access_price_to_exclusive_content_usd: number | null
		allow_value_from_same_creator_tokens_for_exclusive_content: boolean | null
		uploaded_image: {
			image_url: string
		}
		uploaded_video: {
			created_at: Date
			uuid: string
		}
		spl_creator_wallet: {
			user: {
				username: string
				profile_picture: {
					image_url: string
				} | null
			}
		}
	}

	interface RetrievedVideosByCreatorUsername {
		solana_wallet: {
			spl_creator_wallet: {
				spl_name: string
				public_key_address: string
				listing_price_per_share_usd: number
				spl_listing_status: SPLListingStatus
				total_number_of_shares: number
				original_content_url: string
				description: string
				is_spl_exclusive: boolean
				creator_wallet_id: number
				spl_id: number
				value_needed_to_access_exclusive_content_usd: number | null
				is_content_instantly_accessible: boolean | null
				allow_value_from_same_creator_tokens_for_exclusive_content: boolean | null
				instant_access_price_to_exclusive_content_usd: number | null
				uploaded_image: {
					image_url: string
				}
				uploaded_video: {
					created_at: Date
					uuid: string
					videoUrl?: string
				}
			}[]
		} | null
		username: string
		profile_picture: {
			image_url: string
		} | null
	}

	interface RetrievedCreatorsByUsername {
		username: string
		profile_picture: {
			image_url: string
		} | null
	}

	interface ExclusiveVideoData extends SplDataNeededToCheckForExclusiveContentAccess {
		uuid: string
		value_needed_to_access_exclusive_content_usd: number
		allow_value_from_same_creator_tokens_for_exclusive_content: boolean
		instant_access_price_to_exclusive_content_usd: number | null
	}

	interface InstantAccessExclusiveVideoData extends ExclusiveVideoData {
		is_content_instantly_accessible: boolean
		instant_access_price_to_exclusive_content_usd: number
	}

	interface VideoDataSendingToFrontendLessVideoUrl {
		splName: string
		splPublicKey: string
		listingSharePriceUsd: number
		splListingStatus: SPLListingStatus
		description: string
		imageUrl: string
		uuid: string
		totalNumberShares: number
		sharesRemainingForSale: number
		originalContentUrl: string
		contentMintDate: Date
		creatorUsername: string
		creatorProfilePictureUrl: string | null
		isSplExclusive: boolean
		valueNeededToAccessExclusiveContentUsd: number | null
		isContentInstantlyAccessible: boolean | null
		instantAccessPriceToExclusiveContentUsd: number | null
		allowValueFromSameCreatorTokensForExclusiveContent: boolean | null
	}

	interface VideoDataSendingToFrontendWithVideoUrl extends VideoDataSendingToFrontendLessVideoUrl {
		videoUrl?: string
	}

	interface CreatorSearchDataSendingToFrontend {
		creatorUsername: string
		creatorProfilePictureUrl: string | null
	}

	type SearchData = VideoDataSendingToFrontendLessVideoUrl | CreatorSearchDataSendingToFrontend
}

export {}
