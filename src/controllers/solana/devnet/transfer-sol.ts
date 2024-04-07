import _ from "lodash"
import bs58 from "bs58"
import { Request, Response } from "express"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction,
	clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js"
import getSolPriceInUSD from "../../../utils/solana/get-sol-price-in-usd"
import calculateTransactionFee from "../../../utils/solana/calculate-transaction-fee"
import { findSolanaWalletByPublicKey } from "../../../utils/db-operations/read/find/find-solana-wallet"
import addSolTransferRecord from "../../../utils/db-operations/write/sol_transfer/add-sol-transfer-record"

// eslint-disable-next-line max-lines-per-function
export default async function transferSol(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet
		const transferData = req.body.transferSolData as TransferSolData
		const toPublicKey = req.publicKey
		const isRecipientFortunaUser = req.isRecipientFortunaUser
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const transaction = new Transaction()

		transaction.add(
			SystemProgram.transfer({
				fromPubkey: new PublicKey(solanaWallet.public_key),
				toPubkey: toPublicKey,
				lamports: transferData.transferAmountSol * LAMPORTS_PER_SOL
			})
		)

		console.log("to public key", toPublicKey)
		console.log("isRecipientFortunaUser",isRecipientFortunaUser)
		// let keypair: Keypair
		// if (isRecipientFortunaUser === true) {
		// 	const fortunaSecretKey = bs58.decode(process.env.FORTUNA_WALLET_SECRET_KEY)
		// 	keypair = Keypair.fromSecretKey(fortunaSecretKey)
		// } else {
		const senderSecretKey = bs58.decode(solanaWallet.secret_key)
		const keypair = Keypair.fromSecretKey(senderSecretKey)
		// }
		const solPriceInUSD = await getSolPriceInUSD()

		if (_.isNull(solPriceInUSD)) return res.status(500).json({ error: "Internal Server Error: Unable to retrieve last Sol Price" })
		console.log(keypair)
		const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [ keypair ])
		const transactionFeeInSol = await calculateTransactionFee(transactionSignature, "devnet")
		if (transactionFeeInSol === undefined) {
			return res.status(500).json({ error: "Internal Server Error: Unable to determine transaction fee" })
		}
		let payerSolanaWalletId
		if (isRecipientFortunaUser === true) {
			const fortunaSolanaWallet = await findSolanaWalletByPublicKey(process.env.FORTUNA_WALLET_PUBLIC_KEY, "devnet")
			if (_.isNull(fortunaSolanaWallet) || fortunaSolanaWallet === undefined) {
				return res.status(500).json({ error: "Unable to find Fortuna Solana Wallet Details" })
			}
			payerSolanaWalletId = fortunaSolanaWallet.solana_wallet_id
		} else {
			payerSolanaWalletId = solanaWallet.solana_wallet_id
		}
		await addSolTransferRecord(
			toPublicKey.toString(),
			isRecipientFortunaUser,
			transactionSignature,
			transferData.transferAmountSol,
			transactionFeeInSol,
			solanaWallet.solana_wallet_id,
			payerSolanaWalletId,
			solPriceInUSD
		)

		return res.status(200).json({ success: "" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Transfer Sol" })
	}
}

