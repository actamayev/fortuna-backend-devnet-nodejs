import PrismaClientClass from "../../../classes/prisma-client"

export default async function addBlankRecordBlockchainFeesPaidByUser (feePayerSolanaWalletId: number): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const blankBlockchainFeesPaidByUserRecord = await prismaClient.blockchain_fees_paid_by_user.create({
			data: {
				fee_payer_solana_wallet_id: feePayerSolanaWalletId
			}
		})

		return blankBlockchainFeesPaidByUserRecord.blockchain_fees_paid_by_user_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
