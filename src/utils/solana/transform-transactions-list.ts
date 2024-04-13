export default function transformTransactionsList(
	input: RetrievedDBTransactionListData[],
	solanaPublicKey: string
): OutputTransactionData[] {
	return input.map(transaction => transformTransaction(transaction, solanaPublicKey))
}

export function transformTransaction(
	transaction: RetrievedDBTransactionListData,
	solanaPublicKey: string
): OutputTransactionData {
	return {
		solTransferId: transaction.sol_transfer_id,
		solTransferred: transaction.sol_transferred,
		usdTransferred: transaction.usd_transferred,
		transferDateTime: transaction.created_at,
		transferToUsername: transaction.username,
		transferToPublicKey: transaction.recipient_public_key,
		transferFeeSol: transaction.transfer_fee_sol,
		transferFeeUsd: transaction.transfer_fee_usd,
		outgoingOrIncoming: transaction.recipient_public_key === solanaPublicKey ? "incoming" : "outgoing"
	}
}
