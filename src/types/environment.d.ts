declare namespace NodeJS {
	interface ProcessEnv {
		PORT: string

		DATABASE_URL: string

		// Hash:
		SALT_ROUNDS: string

		// JWT:
		JWT_KEY: string

		AWS_ACCESS_KEY_ID: string
		AWS_SECRET_ACCESS_KEY: string
		AWS_REGION: string

		S3_BUCKET: string

		FORTUNA_WALLET_PUBLIC_KEY: string
		FORTUNA_WALLET_SECRET_KEY: string
		FORTUNA_ESCROW_WALLET_PUBLIC_KEY: string

		FORTUNA_SOLANA_WALLET_ID_DB: string // It's actually a number, but when it's read from .env it's converted into a string
		FORTUNA_ESCROW_SOLANA_WALLET_ID_DB: string
	}
}
