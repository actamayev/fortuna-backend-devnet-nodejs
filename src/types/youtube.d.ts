declare global {
	interface RetrievedYouTubeAccessTokensData {
		access_token: string
		refresh_token__encrypted: EncryptedString
		expiry_date: Date
	}

	interface UserYouTubeData {
		subscriberCount: number
		isApprovedToBeCreator: boolean
	}
}

export {}
