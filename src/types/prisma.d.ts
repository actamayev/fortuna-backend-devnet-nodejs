import { credentials, solana_wallet, youtube_access_tokens } from "@prisma/client"

declare global {
	type ExtendedCredentials = credentials & {
		email__encrypted: DeterministicEncryptedString | null

		password: HashedString | null
	}

	type ExtendedSolanaWallet = solana_wallet & {
		secret_key__encrypted: NonDeterministicEncryptedString
	}

	type ExtendedYouTubeAccessTokens = youtube_access_tokens & {
		refresh_token__encrypted: NonDeterministicEncryptedString
	}
}

export {}
