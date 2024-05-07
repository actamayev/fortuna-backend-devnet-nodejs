declare namespace NodeJS {
	interface ProcessEnv {
		// JWT:
		JWT_KEY: string

		S3_BUCKET: string

		// Solana:
		FORTUNA_WALLET_PUBLIC_KEY: string
		FORTUNA_WALLET_SECRET_KEY: string
		FORTUNA_ESCROW_WALLET_PUBLIC_KEY: string
		FORTUNA_ESCROW_WALLET_SECRET_KEY: string

		FORTUNA_SOLANA_WALLET_ID_DB: string // It's actually a number, but when it's read from .env it's converted into a string
		FORTUNA_ESCROW_SOLANA_WALLET_ID_DB: string // It's actually a number, but when it's read from .env it's converted into a string

		// Google Auth:
		GOOGLE_CLIENT_ID: string
		GOOGLE_CLIENT_SECRET: string

		MIN_NUMBER_YOUTUBE_SUBS_TO_BE_FORTUNA_CREATOR: string

		// Production only:
		DATABASE_URL: string
		AWS_ACCESS_KEY_ID: string
		AWS_SECRET_ACCESS_KEY: string
	}
}
