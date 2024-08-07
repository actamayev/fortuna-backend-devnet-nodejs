import _ from "lodash"
import { Connection, Finality, Keypair, LAMPORTS_PER_SOL, PublicKey,
	SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"
import Singleton from "../singleton"
import { getClusterUrlByEnv } from "../../utils/solana/get-cluster-url-by-env"

export default class SolanaManager extends Singleton {
	private connection: Connection
	private readonly commitment: Finality = "confirmed"

	private constructor() {
		super()
		this.connection = new Connection(getClusterUrlByEnv(), this.commitment)
	}

	public static getInstance(): SolanaManager {
		if (_.isNull(SolanaManager.instance)) {
			SolanaManager.instance = new SolanaManager()
		}
		return SolanaManager.instance
	}

	public async calculateTransactionFee(signature: string): Promise<number> {
		let retryDelay = 1000 // Initial delay of 1 second
		for (let i = 0; i < 3; i++) {
			try {
				const feeInSol = await this.getTransactionFee(signature)
				if (!_.isNull(feeInSol)) return feeInSol
			} catch (error) {
				console.error(`Attempt ${i + 1} failed: ${error}`)
			}
			await this.delay(retryDelay)
			retryDelay *= 2 // Exponential backoff
		}
		return 0
	}

	private async getTransactionFee(signature: string): Promise<number | null> {
		try {
			const transactionDetails = await this.connection.getTransaction(signature, {
				commitment: this.commitment,
				maxSupportedTransactionVersion: 0
			})

			if (_.isNull(transactionDetails) || _.isNull(transactionDetails.meta)) {
				console.error("Unable to retrieve transaction details")
				return null
			}

			const fee = transactionDetails.meta.fee
			return fee / LAMPORTS_PER_SOL
		} catch (error) {
			console.error("Error getting transaction fee", error)
			throw error
		}
	}

	private delay(ms: number): Promise<void> {
		console.info("Delaying", ms, "miliseconds")
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	public async transferFunds(
		fromPubkey: PublicKey,
		toPubkey: PublicKey,
		lamports: number,
		keypairs: Keypair[]
	): Promise<string> {
		try {
			const transaction = new Transaction()

			transaction.add(
				SystemProgram.transfer({
					fromPubkey,
					toPubkey,
					lamports
				})
			)

			return await sendAndConfirmTransaction(this.connection, transaction, keypairs)
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
