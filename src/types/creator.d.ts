import { SocialPlatforms, VideoListingStatus } from "@prisma/client"

declare global {
	interface IncomingNewVideoData {
		uuid: string
		uploadedImageId: number
		uploadedVideoId: number
		videoName: string
		description: string
		isContentExclusive: boolean
		tierData: IncomingNewVideoTierData[]
	}

	interface IncomingNewVideoTierData {
		tierNumber: number
		purchasesInThisTier: number | null
		tierAccessPriceUsd: number
	}

	interface VideoTierData extends IncomingNewVideoTierData {
		isTierSoldOut: boolean
	}

	interface RetrievedCreatorDBVideoData {
		video_id: number
		video_name: string
		description: string
		is_video_exclusive: boolean
		video_listing_status: VideoListingStatus
		uuid: string
		created_at: Date
		is_video_featured: boolean
		uploaded_image: {
			image_url: string
		}
		uploaded_video: {
			video_duration_seconds: number
		}
		video_access_tier: {
			tier_number: number
			purchases_allowed_for_this_tier: number | null
			tier_access_price_usd: number
			is_sold_out: boolean
		}[]
		exclusive_video_access_purchase: {
			exclusive_video_access_purchase_sol_transfer: {
				sol_amount_transferred: number
				usd_amount_transferred: number
			}
		}[]
		numberOfExclusivePurchasesSoFar: number | null
		numberOfLikes: number
	}

	interface OutputCreatorVideoData {
		videoId: number
		videoName: string
		videoListingStatus: VideoListingStatus
		description: string
		isVideoFeatured: boolean
		imageUrl: string
		videoDurationSeconds: number
		uuid: string
		isContentExclusive: boolean
		numberOfLikes: number
		createdAt: Date
		tierData: VideoTierData[]
		totalCreatorProfitInSol: number
		totalCreatorProfitInUsd: number
		numberOfExclusivePurchasesSoFar: number | null
	}

	interface CreatorDetails {
		channel_name: {
			channel_name: string
		} | null
		channel_description: {
			channel_description: string
		} | null
		channel_banner: {
			image_url: string
		} | null
		profile_picture: {
			image_url: string
		} | null
		social_platform_link: {
			social_platform: SocialPlatforms
			social_link: string
		}[]
	}

	interface CreatorInfoData {
		channelName: string | null
		channelDescription: string | null
		profilePictureUrl: string | null
		channelBannerUrl: string | null
		socialPlatformLinks: SocialPlatformLinks[]
	}
}

export {}
