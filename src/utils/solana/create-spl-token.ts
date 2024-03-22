import { createMint } from "@solana/spl-token"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import get51SolanaWalletFromSecretKey from "./get-51-solana-wallet-from-secret-key"

export default async function createSPLToken (): Promise<PublicKey | void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"))
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()

		// TODO: Make it impossible to add more than the number of shares the creator wanted.
		const token = await createMint(
			connection,
			fiftyoneWallet,
			fiftyoneWallet.publicKey,
			null,
			9,
		)

		return token
	} catch (error) {
		console.error(error)
	}
}
