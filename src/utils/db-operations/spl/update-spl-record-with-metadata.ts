import prismaClient from "../../../prisma-client"

export default async function updateSPLRecordWithMetadata(
	splId: number,
	fiftyoneCryptoWalletId: number,
	feeInSol: number,
	solPriceInUSD: number
): Promise<void> {
	try {
		await prismaClient.spl.update({
			where: {
				spl_id: splId
			},
			data: {
				spl_metadata_creation_fee_sol: feeInSol,
				spl_metadata_creation_fee_usd: feeInSol * solPriceInUSD,
				create_spl_metadata_payer_solana_wallet_id: fiftyoneCryptoWalletId,
			}
		})
	} catch (error) {
		console.error(error)
	}
}
