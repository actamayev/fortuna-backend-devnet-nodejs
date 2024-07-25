import _ from "lodash"
import { Request, Response } from "express"
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import SolanaManager from "../../classes/solana/solana-manager"
import SolPriceManager from "../../classes/solana/sol-price-manager"
import GetKeypairFromSecretKey from "../../utils/solana/get-keypair-from-secret-key"
import { transformOutgoingTransaction } from "../../utils/transform/transform-transactions-list"
import addSolTransferRecord from "../../db-operations/write/sol-transfer/add-sol-transfer-record"
import calculateTransactionFeeUpdateBlockchainFeesPaidByUserTable
	from "../../utils/solana/calculate-transaction-fee-update-blockchain-fees-paid-by-user-table"
import calculateTransactionFeeUpdateBlockchainFeesPaidByFortunaTable
	from "../../utils/solana/calculate-transaction-fee-update-blockchain-fees-paid-by-fortuna-table"
import addBlankBlockchainFeesPaidByFortuna
	from "../../db-operations/write/blockchain-fees-paid-by-fortuna/add-blank-blockchain-fees-paid-by-fortuna"
import addBlankRecordBlockchainFeesPaidByUser
	from "../../db-operations/write/blockchain-fees-paid-by-user/add-blank-record-blockchain-fees-paid-by-user"

// eslint-disable-next-line max-lines-per-function, complexity
export default async function transferSol(req: Request, res: Response): Promise<Response> {
	try {
		const { user, solanaWallet, recipientPublicKey, isRecipientFortunaWallet, recipientSolanaWalletId } = req
		const moneyTransferData = req.body.moneyTransferData as MoneyTransferData
		const transferDetails: TransferDetails = {
			solToTransfer: 0,
			usdToTransfer: 0,
			defaultCurrency: moneyTransferData.transferCurrency
		}

		const solPrice = (await SolPriceManager.getInstance().getPrice()).price
		if (moneyTransferData.transferCurrency === "sol") {
			transferDetails.solToTransfer = moneyTransferData.transferAmount
			transferDetails.usdToTransfer = moneyTransferData.transferAmount * solPrice
		} else {
			transferDetails.solToTransfer = moneyTransferData.transferAmount / solPrice
			transferDetails.usdToTransfer = moneyTransferData.transferAmount
		}

		// FUTURE TODO: Fix the double-charge problem (when having 2 signers, the fee is doubled)
		// May be possible to fix by making Fortuna a co-signer, if all Fortuna wallets are made to be multi-signature accounts.
		// Would have to think about wheather or not we want this.

		const keypairs: Keypair[] = []
		const senderKeypair = await GetKeypairFromSecretKey.getKeypairFromEncryptedSecretKey(solanaWallet.secret_key__encrypted)
		keypairs.push(senderKeypair)
		if (isRecipientFortunaWallet === true) {
			const fortunaFeePayerWalletKeypair = await GetKeypairFromSecretKey.getFortunaFeePayerWalletKeypair()
			keypairs.unshift(fortunaFeePayerWalletKeypair)
		}

		const transactionSignature = await SolanaManager.getInstance().transferFunds(
			new PublicKey(solanaWallet.public_key),
			recipientPublicKey,
			_.round(transferDetails.solToTransfer * LAMPORTS_PER_SOL),
			keypairs
		)

		let blockchainFeesPaidByUserId: number | undefined
		let blockchainFeesPaidByFortunaId: number | undefined

		if (isRecipientFortunaWallet === true) {
			blockchainFeesPaidByFortunaId = await addBlankBlockchainFeesPaidByFortuna()
		} else {
			blockchainFeesPaidByUserId = await addBlankRecordBlockchainFeesPaidByUser(solanaWallet.solana_wallet_id)
		}

		const solTransferRecord = await addSolTransferRecord(
			recipientPublicKey,
			isRecipientFortunaWallet,
			transactionSignature,
			transferDetails,
			solanaWallet,
			recipientSolanaWalletId,
			blockchainFeesPaidByFortunaId,
			blockchainFeesPaidByUserId
		)

		const transactionToTransform: OutgoingTransactionListData = {
			...solTransferRecord,
			sender_username: user.username || "",
			...(isRecipientFortunaWallet ? {
				recipient_username: moneyTransferData.sendingTo,
				blockchain_fees_paid_by_user: {
					fee_in_sol: 0,
					fee_in_usd: 0
				}
			} : { blockchain_fees_paid_by_user: null })
		}

		const solTransferData = transformOutgoingTransaction(transactionToTransform)

		if (isRecipientFortunaWallet === true) {
			void calculateTransactionFeeUpdateBlockchainFeesPaidByFortunaTable(
				transactionSignature,
				blockchainFeesPaidByFortunaId as number
			)
		} else {
			const blockchainFeesPaidByUser = await calculateTransactionFeeUpdateBlockchainFeesPaidByUserTable(
				transactionSignature,
				blockchainFeesPaidByUserId as number
			)
			solTransferData.withdrawalFeeUsd = blockchainFeesPaidByUser.fee_in_usd || undefined
			solTransferData.withdrawalFeeSol = blockchainFeesPaidByUser.fee_in_sol || undefined
		}

		return res.status(200).json({ solTransferData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Transfer Sol" })
	}
}
