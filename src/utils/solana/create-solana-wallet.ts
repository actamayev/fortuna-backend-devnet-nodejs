import { Keypair } from "@solana/web3.js"

export default function createSolanaWallet(): Keypair {
	try {
		return Keypair.generate()
	} catch (error) {
		console.error(error)
		throw error
	}
}
