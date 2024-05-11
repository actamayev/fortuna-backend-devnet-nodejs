import bs58 from "bs58"
import { Keypair } from "@solana/web3.js"
import Encryptor from "../../classes/encryptor"
import SecretsManager from "../../classes/secrets-manager"

export default class GetKeypairFromSecretKey {
	public static async getFortunaWalletKeypair(): Promise<Keypair> {
		try {
			const fortunaWalletSecretKey = (
				await SecretsManager.getInstance().getSecret("FORTUNA_WALLET_SECRET_KEY")
			) as NonDeterministicEncryptedString

			return this.getKeypairFromEncryptedSecretKey(fortunaWalletSecretKey)
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public static async getFortunaEscrowKeypair(): Promise<Keypair> {
		try {
			// eslint-disable-next-line max-len
			const fortunaEscrowWalletSecretKey = await SecretsManager.getInstance().getSecret("FORTUNA_ESCROW_WALLET_SECRET_KEY") as NonDeterministicEncryptedString

			return this.getKeypairFromEncryptedSecretKey(fortunaEscrowWalletSecretKey)
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public static async getKeypairFromEncryptedSecretKey(secretKey: NonDeterministicEncryptedString): Promise<Keypair> {
		try {
			const encryptor = new Encryptor()
			const decryptedSecretKey = await encryptor.nonDeterministicDecrypt(secretKey, "SECRET_KEY_ENCRYPTION_KEY")
			const decodedSecretKey = bs58.decode(decryptedSecretKey)
			return Keypair.fromSecretKey(decodedSecretKey)
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
