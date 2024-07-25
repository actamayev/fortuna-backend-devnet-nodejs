import _ from "lodash"
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"
import SecretsManager from "../../classes/secrets-manager"
import SolanaManager from "../../classes/solana/solana-manager"
import GetKeypairFromSecretKey from "./get-keypair-from-secret-key"
import calculateTransactionFeeUpdateBlockchainFeesPaidByFortunaTable
	from "./calculate-transaction-fee-update-blockchain-fees-paid-by-fortuna-table"
import addBlankBlockchainFeesPaidByFortuna
	from "../../db-operations/write/blockchain-fees-paid-by-fortuna/add-blank-blockchain-fees-paid-by-fortuna"
import addExclusiveVideoAccessPurchaseTake
	from "../../db-operations/write/exclusive-video-access-purchase-fortuna-take/add-exclusive-video-access-purchase-take"

export default async function transferSolFromCreatorToFortuna(
	contentCreatorPublicKeyAndWalletId: CreatorWalletData,
	transferDetails: TransferDetailsLessDefaultCurrency,
): Promise<number> {
	try {
		const fortunaFeePayerWalletKeypair = await GetKeypairFromSecretKey.getFortunaFeePayerWalletKeypair()

		const creatorKeypair = await GetKeypairFromSecretKey.getKeypairFromEncryptedSecretKey(
			contentCreatorPublicKeyAndWalletId.secret_key__encrypted
		)
		const keypairs: Keypair[] = [fortunaFeePayerWalletKeypair, creatorKeypair]

		const transactionSignature = await SolanaManager.getInstance().transferFunds(
			contentCreatorPublicKeyAndWalletId.public_key,
			fortunaFeePayerWalletKeypair.publicKey,
			_.round(transferDetails.solToTransfer * LAMPORTS_PER_SOL),
			keypairs
		)

		const paidBlockchainFeeId = await addBlankBlockchainFeesPaidByFortuna()

		const fortunaFeePayerSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_FEE_PAYER_WALLET_ID_DB")
		const feePayerSolanaWalletId = parseInt(fortunaFeePayerSolanaWalletIdDb, 10)

		const fortunaTakeId = await addExclusiveVideoAccessPurchaseTake(
			contentCreatorPublicKeyAndWalletId.solana_wallet_id,
			feePayerSolanaWalletId,
			transactionSignature,
			transferDetails,
			paidBlockchainFeeId
		)

		void calculateTransactionFeeUpdateBlockchainFeesPaidByFortunaTable(transactionSignature, paidBlockchainFeeId)

		return fortunaTakeId
	} catch (error) {
		console.error(error)
		throw error
	}
}
