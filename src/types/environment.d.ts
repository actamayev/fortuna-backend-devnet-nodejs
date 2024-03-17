declare namespace NodeJS {
	interface ProcessEnv {
		PORT: string

		// Hash:
		SALT_ROUNDS: string

		// JWT:
		JWT_KEY: string
	}
}
