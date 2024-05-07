import { credentials, solana_wallet, youtube_access_tokens } from "@prisma/client"

declare global {
	type ExtendedCredentials = credentials & {
		email__hashed: HashedString | null
		email__encrypted: EncryptedString | null

		phone_number__hashed: HashedString | null
		phone_number__encrypted: EncryptedString | null
	}

	type ExtendedSolanaWallet = solana_wallet & {
		secret_key__encrypted: EncryptedString
	}

	type ExtendedYouTubeAccessTokens = youtube_access_tokens & {
		refresh_token__encrypted: EncryptedString
	}
}

export {}
