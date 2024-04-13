import calculateTransactionFee from "./calculate-transaction-fee"

export default async function determineTransactionFee(
	signature: string,
	solPriceInUSD: number
): Promise<{ feeInSol: number, usdPrice: number, solPriceInUSD: number }> {
	try {
		const feeInSol = await calculateTransactionFee(signature)
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
