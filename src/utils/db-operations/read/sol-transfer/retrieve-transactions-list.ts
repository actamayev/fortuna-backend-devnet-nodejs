import prismaClient from "../../../../prisma-client"

export default async function retrieveTransactionsList(solanaWalletId: number): Promise<RetrievedDBTransactionListData[] | void> {
	try {
		const transactionsList = await prismaClient.sol_transfer.findMany({
			where: {
				sender_solana_wallet_id: solanaWalletId
			},
			orderBy: {
				created_at: "desc"
			},
			select: {
				sol_transfer_id: true,
				recipient_public_key: true,
				is_recipient_fortuna_user: true,
				sol_transferred: true,
				usd_transferred: true,
				transfer_fee_sol: true,
				transfer_fee_usd: true,
				created_at: true,
				recipient_solana_wallet: {
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

		return transactionsList.map(transaction => ({
			...transaction,
			username: transaction.is_recipient_fortuna_user ? transaction.recipient_solana_wallet?.user.username : null
		}))
	} catch (error) {
		console.error(error)
	}
}
