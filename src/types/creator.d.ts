declare global {
	interface IncomingNewVideoData {
		uuid: string
		uploadedImageId: number
		uploadedVideoId: number
		videoName: string
		imageUrl: string
		description: string
		isContentExclusive: boolean
		tierData: IncomingNewVideoTierData[]
	}

	interface IncomingNewVideoTierData {
		tierNumber: number
		purchasesInThisTier: number | null
		tierDiscount: number
		tierAccessPrice: number
	}

	interface VideoTierData extends IncomingNewVideoTierData {
		isTierSoldOut: boolean
	}

	interface RetrievedCreatorDBVideoData {
		video_id: number
		video_name: string
		description: string
		video_listing_status: VideoListingStatus
		uuid: string
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
		is_video_exclusive: boolean
	}

	interface OutputCreatorVideoData {
		videoId: number
		videoName: string
		videoListingStatus: VideoListingStatus
		description: string
		imageUrl: string
		uuid: string
		isContentExclusive: boolean
		tierData: TierData[]
		numberOfExclusivePurchasesSoFar: number | null
	}
}

export {}
