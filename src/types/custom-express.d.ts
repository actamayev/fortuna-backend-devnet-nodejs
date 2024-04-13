import { PublicKey } from "@solana/web3.js"
import { credentials, solana_wallet } from "@prisma/client"

declare global {
	namespace Express {
		interface Request {
			user: credentials
			solanaWallet: solana_wallet
			recipientPublicKey: PublicKey

			isRecipientFortunaWallet: boolean
			recipientSolanaWalletId: number | undefined
		}
	}
}

export {}
