import _ from "lodash"
import { Commitment, Connection, Keypair, PublicKey,
	SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction
} from "@solana/web3.js"

export default class TransferSolManager {
	private static instance: TransferSolManager | null = null
	private connection: Connection
	private readonly endpoint = clusterApiUrl("devnet")
	private readonly commitment: Commitment = "confirmed"

	private constructor() {
		this.connection = new Connection(this.endpoint, this.commitment)
	}

	public static getInstance(): TransferSolManager {
		if (_.isNull(TransferSolManager.instance)) {
			TransferSolManager.instance = new TransferSolManager()
		}
		return TransferSolManager.instance
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
