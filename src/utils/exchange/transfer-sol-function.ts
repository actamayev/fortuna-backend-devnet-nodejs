import _ from "lodash"
import { Currencies } from "@prisma/client"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram,
	Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js"
import calculateTransactionFee from "../solana/calculate-transaction-fee"
import GetKeypairFromSecretKey from "../solana/get-keypair-from-secret-key"
import addSolTransferRecord from "../../db-operations/write/sol-transfer/add-sol-transfer-record"

export default async function transferSolFunction(
	senderSolanaWallet: ExtendedSolanaWallet,
	recipientPublicKeyAndWalletId: { public_key: PublicKey, solana_wallet_id: number },
	transferDetails: { solToTransfer: number, usdToTransfer: number, defaultCurrency: Currencies },
): Promise<number> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const transaction = new Transaction()

		transaction.add(
			SystemProgram.transfer({
				fromPubkey: new PublicKey(senderSolanaWallet.public_key),
				toPubkey: recipientPublicKeyAndWalletId.public_key,
				lamports: _.round(transferDetails.solToTransfer * LAMPORTS_PER_SOL)
			})
		)
		// FUTURE TODO: Fix the double-charge problem (when having 2 signers, the fee is doubled)
		// May be possible to fix by making Fortuna a co-signer, if all Fortuna wallets are made to be multi-signature accounts.
		// Would have to think about wheather or not we want this.

		const senderKeypair = await GetKeypairFromSecretKey.getKeypairFromEncryptedSecretKey(senderSolanaWallet.secret_key__encrypted)
		const fortunaFeePayerWalletKeypair = await GetKeypairFromSecretKey.getFortunaFeePayerWalletKeypair()
		const keypairs: Keypair[] = [fortunaFeePayerWalletKeypair, senderKeypair]

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
