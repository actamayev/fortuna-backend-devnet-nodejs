export default function transformTransactionsList(
	input: RetrievedDBTransactionListData[],
	solanaPublicKey: string
): OutputTransactionData[] {
	try {
		return input.map(transaction => transformTransaction(transaction, solanaPublicKey))
	} catch (error) {
		console.error(error)
		throw error
	}
}

export function transformTransaction(
	transaction: RetrievedDBTransactionListData,
	solanaPublicKey: string
): OutputTransactionData {
	try {
		return {
			solTransferId: transaction.sol_transfer_id,
			solAmountTransferred: transaction.sol_amount_transferred,
			usdAmountTransferred: transaction.usd_amount_transferred,
			transferDateTime: transaction.created_at,
			transferToUsername: transaction.recipient_username,
			transferToPublicKey: transaction.recipient_public_key,
			transferFromUsername: transaction.sender_username,
			transferFeeSol: transaction.transfer_fee_sol,
			transferFeeUsd: transaction.transfer_fee_usd,
			outgoingOrIncoming: transaction.recipient_public_key === solanaPublicKey ? "incoming" : "outgoing"
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
