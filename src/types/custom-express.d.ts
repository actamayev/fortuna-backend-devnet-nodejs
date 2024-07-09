import { PublicKey } from "@solana/web3.js"

declare global {
	namespace Express {
		interface Request {
			user: ExtendedCredentials
			optionallyAttachedUser: ExtendedCredentials | undefined

			solanaWallet: ExtendedSolanaWallet

			recipientPublicKey: PublicKey

			minimalDataNeededToCheckForExclusiveContentAccess: VideoDataNeededToCheckForExclusiveContentAccess
			exclusiveVideoData: ExclusiveVideoData
			nonExclusiveVideoData: NonExclusiveVideoData
			basicVideoDetails: VideoDataNeededToEditVideoDetails

			isRecipientFortunaWallet: boolean
			recipientSolanaWalletId: number | undefined

			youtubeAccessToken: string
		}
	}
}

export {}
