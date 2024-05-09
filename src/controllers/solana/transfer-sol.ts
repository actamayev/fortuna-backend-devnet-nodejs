import _ from "lodash"
import { Request, Response } from "express"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction,
	clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js"
import SecretsManager from "../../classes/secrets-manager"
import SolPriceManager from "../../classes/sol-price-manager"
import calculateTransactionFee from "../../utils/solana/calculate-transaction-fee"
import GetKeypairFromSecretKey from "../../utils/solana/get-keypair-from-secret-key"
import { transformTransaction } from "../../utils/transform/transform-transactions-list"
import addSolTransferRecord from "../../db-operations/write/sol-transfer/add-sol-transfer-record"

// eslint-disable-next-line max-lines-per-function
export default async function transferSol(req: Request, res: Response): Promise<Response> {
	try {
		const { user, solanaWallet, recipientPublicKey, isRecipientFortunaWallet, recipientSolanaWalletId } = req
		const transferData = req.body.transferSolData as TransferSolData
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const transaction = new Transaction()
		const transferCurrencyAmounts = { solToTransfer: 0, usdToTransfer: 0, defaultCurrency: transferData.transferCurrency }

		const solPrice = (await SolPriceManager.getInstance().getPrice()).price
		if (transferData.transferCurrency === "sol") {
			transferCurrencyAmounts.solToTransfer = transferData.transferAmount
			transferCurrencyAmounts.usdToTransfer = transferData.transferAmount * solPrice
		} else {
			transferCurrencyAmounts.solToTransfer = transferData.transferAmount / solPrice
			transferCurrencyAmounts.usdToTransfer = transferData.transferAmount
		}
		transaction.add(
			SystemProgram.transfer({
				fromPubkey: new PublicKey(solanaWallet.public_key),
				toPubkey: recipientPublicKey,
				lamports: _.round(transferCurrencyAmounts.solToTransfer * LAMPORTS_PER_SOL)
			})
		)
		// FUTURE TODO: Fix the double-charge problem (when having 2 signers, the fee is doubled)
		// May be possible to fix by making Fortuna a co-signer, if all Fortuna wallets are made to be multi-signature accounts.
		// Would have to think about wheather or not we want this.

		const keypairs: Keypair[] = []
		const senderKeypair = await GetKeypairFromSecretKey.getKeypairFromEncryptedSecretKey(solanaWallet.secret_key__encrypted)
		keypairs.push(senderKeypair)
		if (isRecipientFortunaWallet === true) {
			const fortunaWalletKeypair = await GetKeypairFromSecretKey.getFortunaSolanaWalletFromSecretKey()
			keypairs.unshift(fortunaWalletKeypair)
		}
		const transactionSignature = await sendAndConfirmTransaction(connection, transaction, keypairs)
		const transactionFeeInSol = await calculateTransactionFee(transactionSignature)

		let feePayerSolanaWalletId = solanaWallet.solana_wallet_id
		if (isRecipientFortunaWallet === true) {
			const fortunaSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_SOLANA_WALLET_ID_DB")
			feePayerSolanaWalletId = parseInt(fortunaSolanaWalletIdDb, 10)
		}

		const solTransferRecord = await addSolTransferRecord(
			recipientPublicKey,
			isRecipientFortunaWallet,
			transactionSignature,
			transferCurrencyAmounts,
			transactionFeeInSol,
			solanaWallet.solana_wallet_id,
			recipientSolanaWalletId,
			false,
			feePayerSolanaWalletId,
		)

		const transactionToTransform: RetrievedDBTransactionListData = {
			...solTransferRecord,
			sender_username: user.username as string,
			...(isRecipientFortunaWallet ? { recipient_username: transferData.sendingTo } : null)
		}

		const solTransferData = transformTransaction(transactionToTransform, solanaWallet.public_key)
		return res.status(200).json({ solTransferData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Transfer Sol" })
	}
}
