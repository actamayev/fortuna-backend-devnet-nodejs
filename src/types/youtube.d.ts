declare global {
	interface RetrievedYouTubeAccessTokensData {
		access_token: string
		refresh_token__encrypted: string
		expiry_date: Date
	}

	interface TypedRetrievedYouTubeAccessTokensData extends RetrievedYouTubeAccessTokensData {
		refresh_token__encrypted: NonDeterministicEncryptedString
	}
}

export {}
