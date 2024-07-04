import { VideoListingStatus } from "@prisma/client"

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
		video_name: string
		description: string
		is_video_exclusive: boolean
		video_listing_status: VideoListingStatus
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
		numberOfExclusivePurchasesSoFar: number | null
	}

	interface OutputCreatorVideoData {
		videoName: string
		videoListingStatus: VideoListingStatus
		description: string
		imageUrl: string
		uuid: string
		isContentExclusive: boolean
		numberOfExclusivePurchasesSoFar: number | null
		createdAt: Date
		tierData: VideoTierData[]
	}

	interface CreatorDetails {
		channel_name: {
			channel_name: string
		} | null
		channel_description: {
			channel_description: string
		} | null
	}
}

export {}
