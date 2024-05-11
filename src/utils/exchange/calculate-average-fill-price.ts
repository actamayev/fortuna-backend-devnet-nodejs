export default function calculateAverageFillPrice(transactions: TransactionsMap[]): number {
	let totalAmount = 0
	let totalShares = 0

	transactions.forEach(transaction => {
		totalAmount += transaction.fillPriceUsd * transaction.numberOfShares
		totalShares += transaction.numberOfShares
	})

	return totalShares > 0 ? totalAmount / totalShares : 0
}
