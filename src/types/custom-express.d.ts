import { PublicKey } from "@solana/web3.js"

declare global {
	namespace Express {
		interface Request {
			user: ExtendedCredentials
			solanaWallet: ExtendedSolanaWallet
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
