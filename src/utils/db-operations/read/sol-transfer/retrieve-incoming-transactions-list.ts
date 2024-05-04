import prismaClient from "../../../../prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveIncomingTransactionsList(publicKey: string): Promise<RetrievedDBTransactionListData[]> {
	try {
		const incomingTransactionsList = await prismaClient.sol_transfer.findMany({
			where: {
				recipient_public_key: publicKey
			},
			orderBy: {
				created_at: "desc"
			},
			select: {
				sol_transfer_id: true,
				recipient_public_key: true,
				is_recipient_fortuna_wallet: true,
				sol_amount_transferred: true,
				usd_amount_transferred: true,
				transfer_by_currency: true,
				transfer_fee_sol: true,
				transfer_fee_usd: true,
				created_at: true,
				is_spl_purchase: true,
				recipient_solana_wallet: {
					select: {
						user: {
							select: {
								username: true
							}
						}
					}
				},
				sender_solana_wallet: {
					select: {
						user: {
							select: {
								username: true
							}
						}
					}
				}
			}
		})

		const filteredTransactions = incomingTransactionsList.filter(
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			incomingTransaction => incomingTransaction.sender_solana_wallet.user.username !== null
		)

		return filteredTransactions.map(transaction => ({
			...transaction,
			recipient_username: transaction.is_recipient_fortuna_wallet ?
				transaction.recipient_solana_wallet?.user.username || undefined : undefined,
			sender_username: transaction.sender_solana_wallet.user.username
		})) as RetrievedDBTransactionListData[]
	} catch (error) {
		console.error(error)
		throw error
	}
}
