import bs58 from "bs58"
import { Keypair } from "@solana/web3.js"
import SecretsManager from "../../classes/secrets-manager"

export async function getFortunaSolanaWalletFromSecretKey(): Promise<Keypair> {
	try {
		const fortunaWalletSecretKey = await SecretsManager.getInstance().getSecret("FORTUNA_WALLET_SECRET_KEY")

		const fortunaSecretKey = bs58.decode(fortunaWalletSecretKey)
		const fortunaWallet = Keypair.fromSecretKey(fortunaSecretKey)

		return fortunaWallet
	} catch (error) {
		console.error(error)
		throw error
	}
}

export async function getFortunaEscrowSolanaWalletFromSecretKey(): Promise<Keypair> {
	try {
		const fortunaEscrowWalletSecretKey = await SecretsManager.getInstance().getSecret("FORTUNA_ESCROW_WALLET_SECRET_KEY")

		const fortunaEscrowSecretKey = bs58.decode(fortunaEscrowWalletSecretKey)
		const fortunaEscrowWallet = Keypair.fromSecretKey(fortunaEscrowSecretKey)

		return fortunaEscrowWallet
	} catch (error) {
		console.error(error)
		throw error
	}
}
