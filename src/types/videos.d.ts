import { VideoListingStatus } from "@prisma/client"

declare global {
	interface RetrievedHomePageVideosFromDB {
		video_id: number
		video_name: string
		listing_price_to_access_usd: number
		description: string
		creator_wallet_id: number
		is_video_exclusive: boolean
		uuid: string
		created_at: Date
		video_listing_status: VideoListingStatus
		uploaded_image: {
			image_url: string
		}
		video_creator_wallet: {
			user: {
				username: string
				profile_picture: {
					image_url: string
				} | null
			}
		}
		videoUrl?: string
	}

	interface RetrievedVideosByCreatorUsername {
		solana_wallet: {
			video_creator_wallet: {
				video_id: number
				video_name: string
				listing_price_to_access_usd: number
				description: string
				creator_wallet_id: number
				is_video_exclusive: boolean
				uuid: string
				created_at: Date
				video_listing_status: VideoListingStatus
				uploaded_image: {
					image_url: string
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

	interface IncomingNewVideoData {
		uuid: string
		uploadedImageId: number
		uploadedVideoId: number
		videoName: string
		listingPriceToAccessUsd: number
		imageUrl: string
		description: string
		isContentExclusive: boolean
		tierData: TierData[]
	}

	interface TierData {
		tierNumber: number
		purchasesInThisTier: number | null
		tierDiscount: number
	}

	interface RetrievedDBVideoData {
		video_id: number
		video_name: string
		listing_price_to_access_usd: number
		video_listing_status: VideoListingStatus
		description: string
		uuid: string
		uploaded_image: {
			image_url: string
		}
	}

	interface OutputCreatorVideoData {
		videoId: number
		videoName: string
		listingPriceToAccessUsd: number
		videoListingStatus: VideoListingStatus
		description: string
		imageUrl: string
		uuid: string
	}

	interface VideoDataNeededToCheckForExclusiveContentAccess {
		video_id: number
		creator_wallet_id: number
		is_video_exclusive: boolean
		listing_price_to_access_usd: number
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
		listingPriceToAccessUsd: number
		videoListingStatus: VideoListingStatus
		description: string
		imageUrl: string
		uuid: string
		creatorUsername: string
		creatorProfilePictureUrl: string | null
		isVideoExclusive: boolean
		isUserAbleToAccessVideo: boolean
		createdAt: Date
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
