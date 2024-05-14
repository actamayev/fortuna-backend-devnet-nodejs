export default function calculateTransactionData(transactions: TransactionsMap[]): {
	sharesTransacted: number,
	averageFillPrice: number
} {
	let totalAmount = 0
	let totalShares = 0

	transactions.forEach(transaction => {
		totalAmount += transaction.fillPriceUsd * transaction.numberOfShares
		totalShares += transaction.numberOfShares
	})

	return {
		sharesTransacted: totalShares,
		averageFillPrice: totalShares > 0 ? totalAmount / totalShares : 0
	}
}
