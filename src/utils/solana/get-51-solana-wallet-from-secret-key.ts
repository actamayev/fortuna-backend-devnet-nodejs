import bs58 from "bs58"
import { Keypair } from "@solana/web3.js"

export default function get51SolanaWalletFromSecretKey(): Keypair {
	const fiftyoneCryptoSecretKey = bs58.decode(process.env.FIFTYONE_CRYPTO_WALLET_SECRET_KEY)
	const fiftyoneWallet = Keypair.fromSecretKey(fiftyoneCryptoSecretKey)

	return fiftyoneWallet
}
