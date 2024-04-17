import { Keypair, Connection, clusterApiUrl } from "@solana/web3.js"

export default async function createSolanaWallet(): Promise<Keypair> {
	try {
		const wallet = Keypair.generate()

		// This is here to "access" the wallet after creating it.
		// Without doing this, sometimes accessing the wallet in the future doesn't work
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		await connection.getBalance(wallet.publicKey)

		return wallet
	} catch (error) {
		console.error(error)
		throw error
	}
}
