import { Keypair, Connection, clusterApiUrl } from "@solana/web3.js"
import addSolanaWalletRecord from "../db-operations/write/solana-wallet/add-solana-wallet-record"

export default async function createDevnetSolanaWallet(
	userId: number
): Promise<{ publicKey: string, balance: number }> {
	try {
		const wallet = Keypair.generate()
		await addSolanaWalletRecord(wallet, userId)

		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const balance = await connection.getBalance(wallet.publicKey)

		return {
			publicKey: wallet.publicKey.toBase58(),
			balance
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
