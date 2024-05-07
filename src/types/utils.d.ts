declare global {
	type EmailOrPhone = "Email" | "Phone"

	type EmailOrPhoneOrUsername = EmailOrPhone | "Username"

	interface JwtPayload {
		userId: number
		newUser: boolean
	}

	type S3FolderNames =
		"uploaded-images" |
		"uploaded-videos" |
		"spl-metadata" |
		"profile-pictures"

	type EncryptionKeys =
		"SECRET_KEY_ENCRYPTION_KEY" |
		"EMAIL_ENCRYPTION_KEY" |
		"PHONE_NUMBER_ENCRYPTION_KEY" |
		"YT_REFRESH_TOKEN_ENCRYPTION_KEY"

	type SecretKeys =
		EncryptionKeys |
		"DATABASE_URL" |
		"JWT_KEY" |
		"GOOGLE_CLIENT_ID" |
		"GOOGLE_CLIENT_SECRET" |
		"AWS_ACCESS_KEY_ID" |
		"AWS_SECRET_ACCESS_KEY" |
		"S3_BUCKET" |
		"FORTUNA_WALLET_PUBLIC_KEY" |
		"FORTUNA_WALLET_SECRET_KEY" |
		"FORTUNA_ESCROW_WALLET_PUBLIC_KEY" |
		"FORTUNA_ESCROW_WALLET_SECRET_KEY" |
		"FORTUNA_SOLANA_WALLET_ID_DB" |  // Note: Despite being a number, it's stored and handled as a string
		"FORTUNA_ESCROW_SOLANA_WALLET_ID_DB" |  // Same note as above
		"MIN_NUMBER_YOUTUBE_SUBS_TO_BE_FORTUNA_CREATOR"

	type SecretsObject = { [K in SecretKeys]: string }
}

export {}
