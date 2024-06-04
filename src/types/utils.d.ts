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
		"profile-pictures"

	type DeterministicEncryptionKeys =
		"EMAIL_ENCRYPTION_KEY" |
		"PHONE_NUMBER_ENCRYPTION_KEY"

	type NonDeterministicEncryptionKeys =
		"SECRET_KEY_ENCRYPTION_KEY" |
		"YT_REFRESH_TOKEN_ENCRYPTION_KEY"

	type EncryptionKeys = DeterministicEncryptionKeys | NonDeterministicEncryptionKeys

	type SecretKeys =
		EncryptionKeys |
		"AWS_ACCESS_KEY_ID" |
		"AWS_SECRET_ACCESS_KEY" |
		"DATABASE_URL" |
		"JWT_KEY" |
		"PUBLIC_S3_BUCKET" |
		"PRIVATE_S3_BUCKET" |
		"FORTUNA_FEE_PAYER_PUBLIC_KEY" |
		"FORTUNA_FEE_PAYER_SECRET_KEY" |
		"FORTUNA_FEE_PAYER_WALLET_ID_DB" |
		"GOOGLE_CLIENT_ID" |
		"GOOGLE_CLIENT_SECRET" |
		"MIN_NUMBER_YOUTUBE_SUBS_TO_BE_FORTUNA_CREATOR"

	type SecretsObject = { [K in SecretKeys]: string }
	type PublicOrPrivate = "Public" | "Private"
}

export {}
