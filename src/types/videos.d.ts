import { SocialPlatforms, VideoListingStatus } from "@prisma/client"

declare global {
	interface RetrievedHomePageVideosFromDB {
		video_id: number
		video_name: string
		description: string
		creator_user_id: number
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
			tier_access_price_usd: number
			is_sold_out: boolean
		}[]
		video_creator: {
			username: string
			profile_picture: {
				image_url: string
			} | null
		}
		video_like_status: {
			like_status: boolean
			user_id: number
		}[]
		numberOfExclusivePurchasesSoFar: number | null
		videoUrl?: string
	}

	interface RetrievedVideosByCreatorUsername {
		videos: {
			video_id: number
			video_name: string
			video_listing_status: VideoListingStatus
			description: string
			creator_user_id: number
			is_video_exclusive: boolean
			uuid: string
			created_at: Date
			uploaded_image: {
				image_url: string
			}
			video_access_tier: {
				tier_number: number
				purchases_allowed_for_this_tier: number | null
				tier_access_price_usd: number
				is_sold_out: boolean
			}[]
			video_like_status: {
				like_status: boolean
				user_id: number
			}[]
			numberOfExclusivePurchasesSoFar: number | null
		}[]
		username: string
		profile_picture_image_url: string | null
	}

	interface RetrievedCreatorsByUsername {
		username: string
		profile_picture: {
			image_url: string
		} | null
		channel_description: {
			channel_description: string
		} | null
		channel_name: {
			channel_name: string
		} | null
		social_platform_link: {
			social_platform: SocialPlatforms
			social_link: string
		}[]
	}

	interface VideoDataNeededToCheckForExclusiveContentAccess {
		video_id: number
		creator_user_id: number
		is_video_exclusive: boolean
	}

	interface ExclusiveVideoData extends VideoDataNeededToCheckForExclusiveContentAccess {
		uuid: string
		purchases_allowed_for_this_tier: number | null
		tier_access_price_usd: number
		is_tier_sold_out: boolean
		video_access_tier_id: number
		total_number_video_tiers: number
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
		tierData: VideoTierData[]
		numberOfExclusivePurchasesSoFar: number | null
		numberOfLikes: number
		numberOfDislikes: number
		userLikeStatus: boolean | null
	}

	interface VideoDataSendingToFrontendWithVideoUrl extends VideoDataSendingToFrontendLessVideoUrl {
		videoUrl?: string
	}

	interface CreatorSearchDataSendingToFrontend {
		creatorUsername: string
		channelName: string
		channelDescription: string
		socialPlatformLinks: {
			socialPlatform: SocialPlatforms
			socialLink: string
		}[]
		creatorProfilePictureUrl: string | null
	}

	type SearchData = VideoDataSendingToFrontendLessVideoUrl | CreatorSearchDataSendingToFrontend
}

export {}
