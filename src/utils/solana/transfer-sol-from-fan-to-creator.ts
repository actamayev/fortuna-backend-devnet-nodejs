import _ from "lodash"
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import SolanaManager from "../../classes/solana-manager"
import GetKeypairFromSecretKey from "./get-keypair-from-secret-key"
import addBlankRecordBlockchainFeesPaidByFortuna
	from "../../db-operations/write/blockchain-fees-paid-by-fortuna/add-blank-record-blockchain-fees-paid-by-fortuna"
import addExclusiveVideoAccessPurchaseSolTransfer
	from "../../db-operations/write/exclusive-video-access-purchase-sol-transfer/add-exclusive-video-access-purchase-sol-transfer"
import calculateTransactionFeeUpdateBlockchainFeesTable from "./calculate-transaction-fee-update-blockchain-fees-table"

export default async function transferSolFromFanToCreator(
	fanSolanaWallet: ExtendedSolanaWallet,
	contentCreatorPublicKeyAndWalletId: CreatorWalletDataLessSecretKey,
	transferDetails: TransferDetailsLessDefaultCurrency
): Promise<number> {
	try {
		// FUTURE TODO: Fix the double-charge problem (when having 2 signers, the fee is doubled)
		// May be possible to fix by making Fortuna a co-signer, if all Fortuna wallets are made to be multi-signature accounts.
		// Would have to think about wheather or not we want this.

		const fanKeypair = await GetKeypairFromSecretKey.getKeypairFromEncryptedSecretKey(fanSolanaWallet.secret_key__encrypted)
		const fortunaFeePayerWalletKeypair = await GetKeypairFromSecretKey.getFortunaFeePayerWalletKeypair()
		const keypairs: Keypair[] = [fortunaFeePayerWalletKeypair, fanKeypair]

		const transactionSignature = await SolanaManager.getInstance().transferFunds(
			new PublicKey(fanSolanaWallet.public_key),
			contentCreatorPublicKeyAndWalletId.public_key,
			_.round(transferDetails.solToTransfer * LAMPORTS_PER_SOL),
			keypairs
		)

		const paidBlockchainFeeId = await addBlankRecordBlockchainFeesPaidByFortuna()

		const exclusiveVideoAccessPurchaseSolTransferId = await addExclusiveVideoAccessPurchaseSolTransfer(
			fanSolanaWallet.solana_wallet_id,
			contentCreatorPublicKeyAndWalletId.solana_wallet_id,
			transactionSignature,
			transferDetails,
			paidBlockchainFeeId,
		)

		void calculateTransactionFeeUpdateBlockchainFeesTable(transactionSignature, paidBlockchainFeeId)

		return exclusiveVideoAccessPurchaseSolTransferId
	} catch (error) {
		console.error(error)
		throw error
	}
}
