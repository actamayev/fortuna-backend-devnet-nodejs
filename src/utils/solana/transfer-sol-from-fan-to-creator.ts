import _ from "lodash"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram,
	Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js"
import calculateTransactionFee from "./calculate-transaction-fee"
import GetKeypairFromSecretKey from "./get-keypair-from-secret-key"
import addExclusiveVideoAccessPurchaseSolTransfer
	from "../../db-operations/write/exclusive-video-access-purchase-sol-transfer/add-exclusive-video-access-purchase-sol-transfer"
import addBlockchainFeesPaidByFortuna from "../../db-operations/write/blochain-fees-paid-by-fortuna/add-blochain-fees-paid-by-fortuna"

export default async function transferSolFromFanToCreator(
	fanSolanaWallet: ExtendedSolanaWallet,
	contentCreatorPublicKeyAndWalletId: CreatorWalletDataLessSecretKey,
	transferDetails: TransferDetails
): Promise<number> {
	try {
		const transaction = new Transaction()

		transaction.add(
			SystemProgram.transfer({
				fromPubkey: new PublicKey(fanSolanaWallet.public_key),
				toPubkey: contentCreatorPublicKeyAndWalletId.public_key,
				lamports: _.round(transferDetails.solToTransfer * LAMPORTS_PER_SOL)
			})
		)
		// FUTURE TODO: Fix the double-charge problem (when having 2 signers, the fee is doubled)
		// May be possible to fix by making Fortuna a co-signer, if all Fortuna wallets are made to be multi-signature accounts.
		// Would have to think about wheather or not we want this.

		const fanKeypair = await GetKeypairFromSecretKey.getKeypairFromEncryptedSecretKey(fanSolanaWallet.secret_key__encrypted)
		const fortunaFeePayerWalletKeypair = await GetKeypairFromSecretKey.getFortunaFeePayerWalletKeypair()
		const keypairs: Keypair[] = [fortunaFeePayerWalletKeypair, fanKeypair]

		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		const transactionSignature = await sendAndConfirmTransaction(connection, transaction, keypairs)
		const transactionFeeInSol = await calculateTransactionFee(transactionSignature)

		const paidBlockchainFeeId = await addBlockchainFeesPaidByFortuna(transactionFeeInSol)

		const exclusiveVideoAccessPurchaseSolTransferId = await addExclusiveVideoAccessPurchaseSolTransfer(
			fanSolanaWallet.solana_wallet_id,
			contentCreatorPublicKeyAndWalletId.solana_wallet_id,
			transactionSignature,
			transferDetails,
			paidBlockchainFeeId,
		)

		return exclusiveVideoAccessPurchaseSolTransferId
	} catch (error) {
		console.error(error)
		throw error
	}
}
