import { Prisma, PrismaClient } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"

/* eslint-disable max-len */
declare global {
	type EmailOrUsername = "Email" | "Username"

	interface JwtPayload {
		userId: number
		newUser: boolean
	}

	type S3FolderNames =
		"uploaded-images" |
		"uploaded-videos" |
		"profile-pictures" |
		"channel-banner-pictures"

	type DeterministicEncryptionKeys =
		"EMAIL_ENCRYPTION_KEY"

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
		"FORTUNA_FEE_PAYER_SECRET_KEY" |
		"FORTUNA_FEE_PAYER_WALLET_ID_DB" |
		"GOOGLE_CLIENT_ID" |
		"GOOGLE_CLIENT_SECRET"

	type SecretsObject = { [K in SecretKeys]: string }
	type PublicOrPrivate = "Public" | "Private"

	type PrismaType = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
}

export {}
