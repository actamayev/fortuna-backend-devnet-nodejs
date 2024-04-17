import bs58 from "bs58"
import { Keypair } from "@solana/web3.js"

export function getFortunaSolanaWalletFromSecretKey(): Keypair {
	const fortunaSecretKey = bs58.decode(process.env.FORTUNA_WALLET_SECRET_KEY)
	const fortunaWallet = Keypair.fromSecretKey(fortunaSecretKey)

	return fortunaWallet
}

export function getFortunaEscrowSolanaWalletFromSecretKey(): Keypair {
	const fortunaEscrowSecretKey = bs58.decode(process.env.FORTUNA_ESCROW_WALLET_SECRET_KEY)
	const fortunaEscrowWallet = Keypair.fromSecretKey(fortunaEscrowSecretKey)

	return fortunaEscrowWallet
}
