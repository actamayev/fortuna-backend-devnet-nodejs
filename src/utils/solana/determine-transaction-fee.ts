import TransactionFeeCalculator from "../../classes/solana/transaction-fee-calculator"

export default async function determineTransactionFee(
	signature: string,
	solPriceInUSD: number
): Promise<{ feeInSol: number, usdPrice: number, solPriceInUSD: number }> {
	try {
		const feeInSol = await TransactionFeeCalculator.getInstance().calculateTransactionFee(signature)
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
