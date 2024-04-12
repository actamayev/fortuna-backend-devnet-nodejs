export default function transformTransactionsList(
	input: RetrievedDBTransactionListData[],
	solanaPublicKey: string
): OutputTransactionData[] {
	return input.map( item => ({
		solTransferId: item.sol_transfer_id,
		solTransferred: item.sol_transferred,
		usdTransferred: item.usd_transferred,

		transferDateTime: item.created_at,
		transferToUsername: item.username,
		transferToPublicKey: item.recipient_public_key,
		transferFeeSol: item.transfer_fee_sol,
		transferFeeUsd: item.transfer_fee_usd,
		outgoingOrIncoming: item.recipient_public_key === solanaPublicKey ? "incoming" : "outgoing"
	}))
}
