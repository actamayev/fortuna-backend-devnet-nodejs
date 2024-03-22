import { mintTo } from "@solana/spl-token"
import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import addSPLMintRecord from "../db-operations/spl/add-spl-mint-record"
import addSPLOwnershipRecord from "../db-operations/spl/add-spl-ownership-record"

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
	tokenAccountId: number,
	payerSolanaWalletId: number
): Promise<void> {
	try {
		const mintToFiftyoneWalletTransactionSignature = await mintTo(
			connection,
			payerWallet,
			splTokenPublicKey,
			destinationAddress,
			mintAuthority,
			sharesToMint
			// TODO: Figure out what happens if the share count is non-divisiable by 100
			// If the share count is 140, then 51's ownership is 1.4, which won't work b/c the decimal is 0 (shares are indivisible)
		)

		await addSPLMintRecord(
			splId,
			tokenAccountId,
			sharesToMint,
			0, // TODO: Fix this to account for the blockchain mint fee
			payerSolanaWalletId,
			mintToFiftyoneWalletTransactionSignature
		)

		await addSPLOwnershipRecord(
			splId,
			tokenAccountId,
			sharesToMint
		)
	} catch (error) {
		console.error(error)
	}
}
