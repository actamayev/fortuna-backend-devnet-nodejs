import { blockchain_fees_paid_by_user } from "@prisma/client"
import SolanaManager from "../../classes/solana/solana-manager"
import updateBlockchainFeesPaidByUser from "../../db-operations/write/blockchain-fees-paid-by-user/update-blockchain-fees-paid-by-user"

export default async function calculateTransactionFeeUpdateBlockchainFeesPaidByUserTable(
	signature: string,
	blockchainFeesPaidByUserId: number
): Promise<blockchain_fees_paid_by_user> {
	try {
		const feeInSol = await SolanaManager.getInstance().calculateTransactionFee(signature)

		return await updateBlockchainFeesPaidByUser(blockchainFeesPaidByUserId, feeInSol)
	} catch (error) {
		console.error(error)
		throw error
	}
}
