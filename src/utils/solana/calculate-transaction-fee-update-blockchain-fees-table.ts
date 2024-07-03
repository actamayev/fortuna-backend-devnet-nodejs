import TransactionFeeCalculator from "../../classes/solana/transaction-fee-calculator"
import updateBlockchainFeesPaidByFortuna
	from "../../db-operations/write/blockchain-fees-paid-by-fortuna/update-blockchain-fees-paid-by-fortuna"

export default async function calculateTransactionFeeUpdateBlockchainFeesTable(
	signature: string,
	fortunaFeesTableId: number
): Promise<void> {
	try {
		const feeInSol = await TransactionFeeCalculator.getInstance().calculateTransactionFee(signature)

		await updateBlockchainFeesPaidByFortuna(fortunaFeesTableId, feeInSol)
	} catch (error) {
		console.error(error)
	}
}
