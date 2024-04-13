import bs58 from "bs58"
import { Keypair, Connection, clusterApiUrl } from "@solana/web3.js"
import addSolanaWalletRecord from "../db-operations/write/solana-wallet/add-solana-wallet-record"

export default async function createDevnetSolanaWallet(
	userId: number
): Promise<{ publicKey: string, balance: number }> {
	try {
		const wallet = Keypair.generate()
		const publicKey = wallet.publicKey.toBase58()
		const secretKey = bs58.encode(Buffer.from(wallet.secretKey))

		const newSolanaWalletFields: NewSolanaWalletFields = {
			public_key: publicKey,
			secret_key: secretKey,
			user_id: userId
		}
		await addSolanaWalletRecord(newSolanaWalletFields)

		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const balance = await connection.getBalance(wallet.publicKey)

		return { publicKey, balance }
	} catch (error) {
		console.error(error)
		throw error
	}
}
