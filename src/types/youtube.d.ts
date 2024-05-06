declare global {
	interface RetrievedYouTubeAccessTokensData {
		access_token: string
		refresh_token: string
		expiry_date: Date
	}

	interface UserYouTubeData {
		subscriberCount: number
		isApprovedToBeCreator: boolean
	}
}

export {}
