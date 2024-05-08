import { PublicKey } from "@solana/web3.js"

declare global {
	namespace Express {
		interface Request {
			user: ExtendedCredentials
			solanaWallet: ExtendedSolanaWallet
			recipientPublicKey: PublicKey

			splDetails: SplByPublicKeyData

			isRecipientFortunaWallet: boolean
			recipientSolanaWalletId: number | undefined

			youtubeAccessToken: string
		}
	}
}

export {}
