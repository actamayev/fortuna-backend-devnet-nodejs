import { PublicKey } from "@solana/web3.js"

declare global {
	namespace Express {
		interface Request {
			user: ExtendedCredentials
			userId: number | undefined

			solanaWallet: ExtendedSolanaWallet
			optionallyAttachedSolanaWallet: ExtendedSolanaWallet | undefined

			recipientPublicKey: PublicKey

			minimalDataNeededToCheckForExclusiveContentAccess: VideoDataNeededToCheckForExclusiveContentAccess
			exclusiveVideoData: ExclusiveVideoData

			isRecipientFortunaWallet: boolean
			recipientSolanaWalletId: number | undefined

			youtubeAccessToken: string
		}
	}
}

export {}
