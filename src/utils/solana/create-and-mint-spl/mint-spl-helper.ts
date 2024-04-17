import { mintTo } from "@solana/spl-token"
import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import calculateTransactionFee from "../calculate-transaction-fee"
import addSplMintWithOwnership from "../../db-operations/write/simultaneous-writes/add-spl-mint-with-ownership"

// This function is responsible for minting to an account, adding a mint record to DB, and adding a mint ownership record to DB
// eslint-disable-next-line max-params
export default async function mintSPLHelper(
	connection: Connection,
	payerWallet: Keypair,
	splTokenPublicKey: PublicKey,
	splId: number,
	mintAuthority: PublicKey,
	destinationAddress: PublicKey,
	sharesToMint: number,
	tokenAccountId: number
): Promise<void> {
	try {
		const mintTransactionSignature = await mintTo(
			connection,
			payerWallet,
			splTokenPublicKey,
			destinationAddress,
			mintAuthority,
			sharesToMint
			// ASAP TODO: Figure out what happens if the share count is non-divisiable by 100
			// If the share count is 140, then Fortuna's ownership is 1.4, which won't work b/c the decimal is 0 (shares are indivisible)
		)

		const feeInSol = await calculateTransactionFee(mintTransactionSignature)

		await addSplMintWithOwnership(
			splId,
			tokenAccountId,
			sharesToMint,
			feeInSol,
			mintTransactionSignature

		)
	} catch (error) {
		console.error(error)
		throw error
	}
}
