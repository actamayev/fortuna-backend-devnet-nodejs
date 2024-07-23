export default function transformTransactionsList(
	outgoingTransactionsList: OutgoingTransactionListData[],
	incomingTransactionsList: IncomingTransactionListData[]
): OutputTransactionData[] {
	try {
		const transformedOutgoingTransactions = outgoingTransactionsList.map(
			outgoingTransaction => transformOutgoingTransaction(outgoingTransaction)
		)
		const transformedIncomingTransactions = incomingTransactionsList.map(
			incomingTransaction => transformIncomingTransaction(incomingTransaction)
		)

		const combinedTransactionsList = transformedOutgoingTransactions.concat(transformedIncomingTransactions)

		return combinedTransactionsList.sort((a, b) => {
			const dateA = new Date(a.transferDateTime)
			const dateB = new Date(b.transferDateTime)
			return dateA.getTime() - dateB.getTime()
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}

export function transformOutgoingTransaction(transaction: OutgoingTransactionListData): OutputTransactionData {
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
			depositOrWithdrawal: "withdrawal",
			newWalletBalanceSol: transaction.sender_new_wallet_balance_sol,
			newWalletBalanceUsd: transaction.sender_new_wallet_balance_usd,
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}

export function transformIncomingTransaction(transaction: IncomingTransactionListData): OutputTransactionData {
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
			depositOrWithdrawal: "deposit",
			newWalletBalanceSol: transaction.recipient_new_wallet_balance_sol,
			newWalletBalanceUsd: transaction.recipient_new_wallet_balance_usd
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
