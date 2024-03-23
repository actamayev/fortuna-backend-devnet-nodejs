import { credentials, solana_wallet } from "@prisma/client"
import { PublicKey } from "@solana/web3.js"

declare global {
	namespace Express {
		interface Request {
			user: credentials
			solanaWallet: solana_wallet
			publicKey: PublicKey
		}
	}
}

export {}
