declare namespace NodeJS {
	interface ProcessEnv {
		// JWT:
		JWT_KEY: string

		S3_BUCKET: string

		// Solana:
		FORTUNA_FEE_PAYER_PUBLIC_KEY: string
		FORTUNA_FEE_PAYER_SECRET_KEY: string

		FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_PUBLIC_KEY: string

		FORTUNA_TOKENS_WALLET_PUBLIC_KEY: string

		// The ID_DB fields are actually numbers, but interpreted as a string when read from .env
		FORTUNA_FEE_PAYER_WALLET_ID_DB: string
		FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB: string
		FORTUNA_TOKENS_WALLET_ID_DB: string

		// Google Auth:
		GOOGLE_CLIENT_ID: string
		GOOGLE_CLIENT_SECRET: string

		MIN_NUMBER_YOUTUBE_SUBS_TO_BE_FORTUNA_CREATOR: string

		// Encryption:
		SECRET_KEY_ENCRYPTION_KEY: NonDeterministicEncryptionKeys
		EMAIL_ENCRYPTION_KEY: DeterministicEncryptionKeys
		PHONE_NUMBER_ENCRYPTION_KEY: DeterministicEncryptionKeys
		YT_REFRESH_TOKEN_ENCRYPTION_KEY: NonDeterministicEncryptionKeys

		// Production only:
		DATABASE_URL: string
		AWS_ACCESS_KEY_ID: string
		AWS_SECRET_ACCESS_KEY: string
	}
}
