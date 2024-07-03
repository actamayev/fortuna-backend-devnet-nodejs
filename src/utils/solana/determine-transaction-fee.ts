import SolanaManager from "../../classes/solana/solana-manager"

export default async function determineTransactionFee(
	signature: string,
	solPriceInUSD: number
): Promise<{ feeInSol: number, usdPrice: number, solPriceInUSD: number }> {
	try {
		const feeInSol = await SolanaManager.getInstance().calculateTransactionFee(signature)
		const usdPrice = feeInSol * solPriceInUSD

		return {
			feeInSol,
			usdPrice,
			solPriceInUSD
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
