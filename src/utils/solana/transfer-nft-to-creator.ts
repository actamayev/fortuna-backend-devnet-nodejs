import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token"
import get51SolanaWalletFromSecretKey from "./get-51-solana-wallet-from-secret-key"

export default async function transferNFTToCreator(
	splTokenPublicKey: PublicKey,
	creatorPublicKey: PublicKey
): Promise<void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"))
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()

		const fiftyoneTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			fiftyoneWallet.publicKey
		)

		const creatorTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			creatorPublicKey
		)

		const transactionSignature = await transfer(
			connection,
			fiftyoneWallet,
			fiftyoneTokenAccount.address,
			creatorTokenAccount.address,
			fiftyoneWallet.publicKey,
			1
		)

		// TODO: Record the transaction signature in the NFT Transfers table, and update the NFT Ownership table
	} catch (error) {
		console.error(error)
	}
}
