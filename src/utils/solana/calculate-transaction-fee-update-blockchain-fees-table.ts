import calculateTransactionFee from "./calculate-transaction-fee"
import updateBlockchainFeesPaidByFortuna
	from "../../db-operations/write/blockchain-fees-paid-by-fortuna/update-blockchain-fees-paid-by-fortuna"

export default async function calculateTransactionFeeUpdateBlockchainFeesTable(
	signature: string,
	fortunaFeesTableId: number
): Promise<void> {
	try {
		const feeInSol = await calculateTransactionFee(signature)

		await updateBlockchainFeesPaidByFortuna(fortunaFeesTableId, feeInSol)
	} catch (error) {
		console.error(error)
	}
}
