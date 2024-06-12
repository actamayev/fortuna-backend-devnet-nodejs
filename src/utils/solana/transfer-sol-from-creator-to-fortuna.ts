import _ from "lodash"
import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram,
	Transaction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js"
import SecretsManager from "../../classes/secrets-manager"
import calculateTransactionFee from "./calculate-transaction-fee"
import GetKeypairFromSecretKey from "./get-keypair-from-secret-key"
import addExclusiveVideoAccessPurchaseTake
	from "../../db-operations/write/exclusive-video-access-purchase-fortuna-take/add-exclusive-video-access-purchase-take"
import addBlockchainFeesPaidByFortuna from "../../db-operations/write/blochain-fees-paid-by-fortuna/add-blochain-fees-paid-by-fortuna"

export default async function transferSolFromCreatorToFortuna(
	contentCreatorPublicKeyAndWalletId: CreatorWalletData,
	transferDetails: TransferDetailsLessDefaultCurrency,
): Promise<number> {
	try {
		const fortunaFeePayerWalletKeypair = await GetKeypairFromSecretKey.getFortunaFeePayerWalletKeypair()
		const transaction = new Transaction()

		transaction.add(
			SystemProgram.transfer({
				fromPubkey: contentCreatorPublicKeyAndWalletId.public_key,
				toPubkey: fortunaFeePayerWalletKeypair.publicKey,
				lamports: _.round(transferDetails.solToTransfer * LAMPORTS_PER_SOL)
			})
		)
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		const creatorKeypair = await GetKeypairFromSecretKey.getKeypairFromEncryptedSecretKey(
			contentCreatorPublicKeyAndWalletId.secret_key__encrypted
		)

		const keypairs: Keypair[] = [fortunaFeePayerWalletKeypair, creatorKeypair]

		const transactionSignature = await sendAndConfirmTransaction(connection, transaction, keypairs)
		const transactionFeeInSol = await calculateTransactionFee(transactionSignature)

		const paidBlockchainFeeId = await addBlockchainFeesPaidByFortuna(transactionFeeInSol)

		const fortunaFeePayerSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_FEE_PAYER_WALLET_ID_DB")
		const feePayerSolanaWalletId = parseInt(fortunaFeePayerSolanaWalletIdDb, 10)

		const fortunaTakeId = await addExclusiveVideoAccessPurchaseTake(
			contentCreatorPublicKeyAndWalletId.solana_wallet_id,
			feePayerSolanaWalletId,
			transactionSignature,
			transferDetails,
			paidBlockchainFeeId
		)

		return fortunaTakeId
	} catch (error) {
		console.error(error)
		throw error
	}
}
