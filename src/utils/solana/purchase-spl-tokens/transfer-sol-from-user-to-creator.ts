import _ from "lodash"
import bs58 from "bs58"
import { Currencies, solana_wallet } from "@prisma/client"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram,
	Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js"
import calculateTransactionFee from "../calculate-transaction-fee"
import addSolTransferRecord from "../../db-operations/write/sol-transfer/add-sol-transfer-record"

// eslint-disable-next-line max-lines-per-function
export default async function transferSolFromUserToCreator(
	senderSolanaWallet: solana_wallet,
	recipientPublicKeyAndWalletId: { public_key: string, solana_wallet_id: number },
	transferDetails: { solToTransfer: number, usdToTransfer: number, defaultCurrency: Currencies },
): Promise<number> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const transaction = new Transaction()

		transaction.add(
			SystemProgram.transfer({
				fromPubkey: new PublicKey(senderSolanaWallet.public_key),
				toPubkey: new PublicKey(recipientPublicKeyAndWalletId.public_key),
				lamports: _.round(transferDetails.solToTransfer * LAMPORTS_PER_SOL)
			})
		)
		// FUTURE TODO: Fix the double-charge problem (when having 2 signers, the fee is doubled)
		// May be possible to fix by making Fortuna a co-signer, if all Fortuna wallets are made to be multi-signature accounts.
		// Would have to think about wheather or not we want this.

		const senderSecretKey = bs58.decode(senderSolanaWallet.secret_key)
		const senderKeypair = Keypair.fromSecretKey(senderSecretKey)
		const fortunaSecretKey = bs58.decode(process.env.FORTUNA_WALLET_SECRET_KEY)
		const fortunaKeypair = Keypair.fromSecretKey(fortunaSecretKey)

		const keypairs: Keypair[] = [fortunaKeypair, senderKeypair]

		const transactionSignature = await sendAndConfirmTransaction(connection, transaction, keypairs)
		const transactionFeeInSol = await calculateTransactionFee(transactionSignature)

		const solTransferRecord = await addSolTransferRecord(
			recipientPublicKeyAndWalletId.public_key,
			true,
			transactionSignature,
			transferDetails,
			transactionFeeInSol,
			senderSolanaWallet.solana_wallet_id,
			recipientPublicKeyAndWalletId.solana_wallet_id,
			true
		)

		return solTransferRecord.sol_transfer_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
