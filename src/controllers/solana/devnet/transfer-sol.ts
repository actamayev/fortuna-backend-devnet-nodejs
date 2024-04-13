import _ from "lodash"
import bs58 from "bs58"
import { Request, Response } from "express"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction,
	clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js"
import calculateTransactionFee from "../../../utils/solana/calculate-transaction-fee"
import { transformTransaction } from "../../../utils/solana/transform-transactions-list"
import { findSolanaWalletByPublicKey } from "../../../utils/db-operations/read/find/find-solana-wallet"
import addSolTransferRecord from "../../../utils/db-operations/write/sol_transfer/add-sol-transfer-record"

// eslint-disable-next-line max-lines-per-function, complexity
export default async function transferSol(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet
		const transferData = req.body.transferSolData as TransferSolData
		const toPublicKey = req.publicKey
		const isRecipientFortunaWallet = req.isRecipientFortunaWallet
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const transaction = new Transaction()
		const recipientSolanaWalletId = req.recipientSolanaWalletId

		transaction.add(
			SystemProgram.transfer({
				fromPubkey: new PublicKey(solanaWallet.public_key),
				toPubkey: toPublicKey,
				lamports: transferData.transferAmountSol * LAMPORTS_PER_SOL
			})
		)
		// TODO: Fix the double-charge problem (when having 2 signers, the fee is doubled)

		const keypairs: Keypair[] = []
		const senderSecretKey = bs58.decode(solanaWallet.secret_key)
		const senderKeypair = Keypair.fromSecretKey(senderSecretKey)
		keypairs.push(senderKeypair)
		if (isRecipientFortunaWallet === true) {
			const fortunaSecretKey = bs58.decode(process.env.FORTUNA_WALLET_SECRET_KEY)
			const fortunaKeypair = Keypair.fromSecretKey(fortunaSecretKey)
			keypairs.unshift(fortunaKeypair)
		}
		const transactionSignature = await sendAndConfirmTransaction(connection, transaction, keypairs)
		const transactionFeeInSol = await calculateTransactionFee(transactionSignature, "devnet")
		if (transactionFeeInSol === undefined) {
			return res.status(500).json({ error: "Internal Server Error: Unable to determine transaction fee" })
		}
		let payerSolanaWalletId
		if (isRecipientFortunaWallet === true) {
			const fortunaSolanaWallet = await findSolanaWalletByPublicKey(process.env.FORTUNA_WALLET_PUBLIC_KEY, "devnet")
			if (_.isNull(fortunaSolanaWallet) || fortunaSolanaWallet === undefined) {
				return res.status(500).json({ error: "Unable to find Fortuna Solana Wallet Details" })
			}
			payerSolanaWalletId = fortunaSolanaWallet.solana_wallet_id
		} else {
			payerSolanaWalletId = solanaWallet.solana_wallet_id
		}

		const solTransferRecord = await addSolTransferRecord(
			toPublicKey.toString(),
			isRecipientFortunaWallet,
			transactionSignature,
			transferData,
			transactionFeeInSol,
			solanaWallet.solana_wallet_id,
			payerSolanaWalletId,
			recipientSolanaWalletId,
		)

		if (solTransferRecord === undefined) return res.status(500).json({ error: "Internal Server Error: Unable to Save Transfer Record"})
		if (isRecipientFortunaWallet === true) {
			solTransferRecord.username = transferData.sendingTo
		}
		const solTransferData = transformTransaction(solTransferRecord, solanaWallet.public_key)
		return res.status(200).json({ solTransferData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Transfer Sol" })
	}
}

