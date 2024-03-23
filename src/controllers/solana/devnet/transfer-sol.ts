import bs58 from "bs58"
import { Request, Response } from "express"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction,
	clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js"

export default async function transferSol(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet
		const transferData = req.body.transferData
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const transaction = new Transaction()

		const fromPublicKey = new PublicKey(solanaWallet.public_key)
		const recipientPublicKey = new PublicKey(transferData.recipientPublicKey)
		transaction.add(
			SystemProgram.transfer({
				fromPubkey: fromPublicKey,
				toPubkey: recipientPublicKey,
				lamports: transferData.transferAmountSol * LAMPORTS_PER_SOL
			})
		)

		const fiftyoneCryptoSecretKey = bs58.decode(solanaWallet.secret_key)
		const keypair = Keypair.fromSecretKey(fiftyoneCryptoSecretKey)

		// Send the serialized transaction
		await sendAndConfirmTransaction(connection, transaction, [ keypair ])

		return res.status(200).json({ success: "" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Get Transaction Fee" })
	}
}

