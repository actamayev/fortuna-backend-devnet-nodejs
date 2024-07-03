import _ from "lodash"
import { Request, Response } from "express"
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import SolanaManager from "../../classes/solana-manager"
import SolPriceManager from "../../classes/sol-price-manager"
import calculateTransactionFee from "../../utils/solana/calculate-transaction-fee"
import GetKeypairFromSecretKey from "../../utils/solana/get-keypair-from-secret-key"
import { transformTransaction } from "../../utils/transform/transform-transactions-list"
import addSolTransferRecord from "../../db-operations/write/sol-transfer/add-sol-transfer-record"
import addBlockchainFeesPaidByFortuna from "../../db-operations/write/blockchain-fees-paid-by-fortuna/add-blockchain-fees-paid-by-fortuna"

// eslint-disable-next-line max-lines-per-function
export default async function transferSol(req: Request, res: Response): Promise<Response> {
	try {
		const { user, solanaWallet, recipientPublicKey, isRecipientFortunaWallet, recipientSolanaWalletId } = req
		const transferData = req.body.transferFundsData as TransferFundsData
		const transferDetails: TransferDetails = {
			solToTransfer: 0,
			usdToTransfer: 0,
			defaultCurrency: transferData.transferCurrency
		}

		const solPrice = (await SolPriceManager.getInstance().getPrice()).price
		if (transferData.transferCurrency === "sol") {
			transferDetails.solToTransfer = transferData.transferAmount
			transferDetails.usdToTransfer = transferData.transferAmount * solPrice
		} else {
			transferDetails.solToTransfer = transferData.transferAmount / solPrice
			transferDetails.usdToTransfer = transferData.transferAmount
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
		const transactionFeeInSol = await calculateTransactionFee(transactionSignature)

		let feePayerSolanaWalletId: undefined | number
		if (isRecipientFortunaWallet === false) feePayerSolanaWalletId = solanaWallet.solana_wallet_id

		const paidBlockchainFeeId = await addBlockchainFeesPaidByFortuna(transactionFeeInSol, feePayerSolanaWalletId)

		const solTransferRecord = await addSolTransferRecord(
			recipientPublicKey,
			isRecipientFortunaWallet,
			transactionSignature,
			transferDetails,
			solanaWallet.solana_wallet_id,
			paidBlockchainFeeId,
			recipientSolanaWalletId
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
