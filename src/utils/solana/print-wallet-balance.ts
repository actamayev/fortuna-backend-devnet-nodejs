import _ from "lodash"
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js"
import SecretsManager from "../../classes/secrets-manager"

// This file is for testing purposes
export default async function printWalletBalance(initialLogMessage: string): Promise<void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fortunaFeePayerWalletPublicKey = await SecretsManager.getInstance().getSecret("FORTUNA_FEE_PAYER_PUBLIC_KEY")
		const publicKey = new PublicKey(fortunaFeePayerWalletPublicKey)

		const balanceInLamports = await connection.getBalance(publicKey)
		const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL
		const solPriceInUSD = 175

		if (_.isNull(solPriceInUSD)) return

		console.info(initialLogMessage)
		console.info("balanceInSol:",balanceInSol)
		console.info("balance in USD:", balanceInSol * solPriceInUSD)
		console.info("------------------------------------------------")
	} catch (error) {
		console.error(error)
		throw error
	}
}
