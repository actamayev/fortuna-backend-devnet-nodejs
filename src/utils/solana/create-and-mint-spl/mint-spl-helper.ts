import { mintTo } from "@solana/spl-token"
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js"
import calculateTransactionFee from "../calculate-transaction-fee"
import addSplMintWithOwnership from "../../../db-operations/write/simultaneous-writes/add-spl-mint-with-ownership"

// This function is responsible for minting to an account, adding a mint record to DB, and adding a mint ownership record to DB
// eslint-disable-next-line max-params
export default async function mintSPLHelper(
	payerWallet: Keypair,
	splTokenPublicKey: PublicKey,
	splId: number,
	mintAuthority: PublicKey,
	destinationAddress: PublicKey,
	sharesToMint: number,
	tokenAccountId: number,
	solanaWalletId: number
): Promise<void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		const mintTransactionSignature = await mintTo(
			connection,
			payerWallet,
			splTokenPublicKey,
			destinationAddress,
			mintAuthority,
			sharesToMint
		)

		const feeInSol = await calculateTransactionFee(mintTransactionSignature)

		await addSplMintWithOwnership(
			splId,
			tokenAccountId,
			sharesToMint,
			feeInSol,
			mintTransactionSignature,
			solanaWalletId
		)
	} catch (error) {
		console.error(error)
		throw error
	}
}
