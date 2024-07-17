export default function transformTransactionsList(
	input: RetrievedDBTransactionListData[],
	solanaWalletPublicKey: string
): OutputTransactionData[] {
	try {
		const transformedTransactions = input.map(transaction => transformTransaction(transaction, solanaWalletPublicKey))
		const sortedTransactions = transformedTransactions.sort((a, b) => {
			const dateA = new Date(a.transferDateTime)
			const dateB = new Date(b.transferDateTime)
			return dateA.getTime() - dateB.getTime()
		})
		return sortedTransactions
	} catch (error) {
		console.error(error)
		throw error
	}
}

export function transformTransaction(
	transaction: RetrievedDBTransactionListData,
	solanaWalletPublicKey: string
): OutputTransactionData {
	try {
		return {
			solTransferId: transaction.sol_transfer_id,
			solAmountTransferred: transaction.sol_amount_transferred,
			usdAmountTransferred: transaction.usd_amount_transferred,
			transferByCurrency: transaction.transfer_by_currency,
			transferDateTime: transaction.created_at,
			transferToUsername: transaction.recipient_username,
			transferToPublicKey: transaction.recipient_public_key,
			transferFromUsername: transaction.sender_username,
			depositOrWithdrawal: transaction.recipient_public_key === solanaWalletPublicKey ? "deposit" : "withdrawal"
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
