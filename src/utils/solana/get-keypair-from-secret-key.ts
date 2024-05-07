import bs58 from "bs58"
import { Keypair } from "@solana/web3.js"
import Encryptor from "../../classes/encrypt"
import SecretsManager from "../../classes/secrets-manager"

export default class GetKeypairFromSecretKey {
	public static async getFortunaSolanaWalletFromSecretKey(): Promise<Keypair> {
		try {
			const fortunaWalletSecretKey = await SecretsManager.getInstance().getSecret("FORTUNA_WALLET_SECRET_KEY")

			return await this.getGenericKeypairFromSecretKey(fortunaWalletSecretKey)
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public static async getFortunaEscrowSolanaWalletFromSecretKey(): Promise<Keypair> {
		try {
			const fortunaEscrowWalletSecretKey = await SecretsManager.getInstance().getSecret("FORTUNA_ESCROW_WALLET_SECRET_KEY")

			return await this.getGenericKeypairFromSecretKey(fortunaEscrowWalletSecretKey)
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public static async getGenericKeypairFromSecretKey(secretKey: string): Promise<Keypair> {
		try {
			const encryptor = new Encryptor()
			const decryptedSecretKey = await encryptor.decrypt(secretKey)
			const decodedSecretKey = bs58.decode(decryptedSecretKey)
			return Keypair.fromSecretKey(decodedSecretKey)
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
