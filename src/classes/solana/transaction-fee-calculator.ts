import _ from "lodash"
import { Connection, Finality, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"

export default class TransactionFeeCalculator {
	private static instance: TransactionFeeCalculator | null = null
	private connection: Connection
	private readonly endpoint = clusterApiUrl("devnet")
	private readonly commitment: Finality = "confirmed"

	private constructor() {
		this.connection = new Connection(this.endpoint, this.commitment)
	}

	public static getInstance(): TransactionFeeCalculator {
		if (_.isNull(TransactionFeeCalculator.instance)) {
			TransactionFeeCalculator.instance = new TransactionFeeCalculator()
		}
		return TransactionFeeCalculator.instance
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
		console.log("Delaying", ms, "miliseconds")
		return new Promise((resolve) => setTimeout(resolve, ms))
	}
}
