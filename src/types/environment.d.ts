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

		AWS_S3_BUCKET_NAME: string
	}
}
