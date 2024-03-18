declare namespace NodeJS {
	interface ProcessEnv {
		PORT: string

		DATABASE_URL: string

		// Hash:
		SALT_ROUNDS: string

		// JWT:
		JWT_KEY: string

		SOLANA_DEVNET_API: string
	}
}
