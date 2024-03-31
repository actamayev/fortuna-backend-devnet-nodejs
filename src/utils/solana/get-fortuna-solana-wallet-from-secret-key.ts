import bs58 from "bs58"
import { Keypair } from "@solana/web3.js"

export default function getFortunaSolanaWalletFromSecretKey(): Keypair {
	const fortunaCryptoSecretKey = bs58.decode(process.env.FORTUNA_WALLET_SECRET_KEY)
	const fortunaWallet = Keypair.fromSecretKey(fortunaCryptoSecretKey)

	return fortunaWallet
}
