import { VideoListingStatus } from "@prisma/client"

declare global {
	interface RetrievedHomePageVideosFromDB {
		video_id: number
		video_name: string
		description: string
		creator_wallet_id: number
		is_video_exclusive: boolean
		uuid: string
		created_at: Date
		video_listing_status: VideoListingStatus
		uploaded_image: {
			image_url: string
		}
		video_access_tier: {
			tier_number: number
			purchases_allowed_for_this_tier: number | null
			percent_discount_at_this_tier: number
			tier_access_price_usd: number
		}[]
		video_creator_wallet: {
			user: {
				username: string
				profile_picture: {
					image_url: string
				} | null
			}
		}
		numberOfExclusivePurchasesSoFar: number
		videoUrl?: string
	}

	interface RetrievedVideosByCreatorUsername {
		solana_wallet: {
			video_creator_wallet: {
				video_id: number
				video_name: string
				description: string
				creator_wallet_id: number
				is_video_exclusive: boolean
				uuid: string
				created_at: Date
				video_listing_status: VideoListingStatus
				uploaded_image: {
					image_url: string
				}
				video_access_tier: {
					tier_number: number
					purchases_allowed_for_this_tier: number | null
					percent_discount_at_this_tier: number
					tier_access_price_usd: number
				}[]
				numberOfExclusivePurchasesSoFar: number
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

	interface VideoDataNeededToCheckForExclusiveContentAccess {
		video_id: number
		creator_wallet_id: number
		is_video_exclusive: boolean
	}

	interface ExclusiveVideoData extends VideoDataNeededToCheckForExclusiveContentAccess {
		uuid: string
	}

	interface MyExclusiveContentData {
		videoName: string
		imageUrl: string
		uuid: string
	}

	interface RetrievedMyExclusiveContentData {
		video: {
			video_name: string
			uuid: string
			uploaded_image: {
				image_url: string
			}
		}
	}

	interface VideoDataSendingToFrontendLessVideoUrl {
		videoName: string
		videoListingStatus: VideoListingStatus
		description: string
		imageUrl: string
		uuid: string
		creatorUsername: string
		creatorProfilePictureUrl: string | null
		isVideoExclusive: boolean
		isUserAbleToAccessVideo: boolean
		createdAt: Date
		tierData: TierData[]
		numberOfExclusivePurchasesSoFar: number | null
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
