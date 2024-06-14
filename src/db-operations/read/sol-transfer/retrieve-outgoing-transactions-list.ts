import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveOutgoingTransactionsList(solanaWalletId: number): Promise<RetrievedDBTransactionListData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const outgoingTransactionsList = await prismaClient.sol_transfer.findMany({
			where: {
				sender_solana_wallet_id: solanaWalletId
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
				created_at: true,
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

		const filteredTransactions = outgoingTransactionsList.filter(
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			outgoingTransaction => outgoingTransaction.sender_solana_wallet.user.username !== null
		)

		return filteredTransactions.map(transaction => ({
			...transaction,
			recipient_public_key: transaction.is_recipient_fortuna_wallet ? undefined : transaction.recipient_public_key,
			recipient_username: transaction.is_recipient_fortuna_wallet ?
				transaction.recipient_solana_wallet?.user.username || undefined : undefined,
			sender_username: transaction.sender_solana_wallet.user.username
		})) as RetrievedDBTransactionListData[]
	} catch (error) {
		console.error(error)
		throw error
	}
}
