import SolanaManager from "../../classes/solana/solana-manager"
import updateBlockchainFeesPaidByFortuna
	from "../../db-operations/write/blockchain-fees-paid-by-fortuna/update-blockchain-fees-paid-by-fortuna"

export default async function calculateTransactionFeeUpdateBlockchainFeesPaidByFortunaTable(
	signature: string,
	blockchainFeesPaidByFortunaId: number
): Promise<void> {
	try {
		const feeInSol = await SolanaManager.getInstance().calculateTransactionFee(signature)

		await updateBlockchainFeesPaidByFortuna(blockchainFeesPaidByFortunaId, feeInSol)
	} catch (error) {
		console.error(error)
		throw error
	}
}
