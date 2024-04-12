import prismaClient from "../../../../prisma-client"

export default async function retrieveOutgoingTransactionsList(solanaWalletId: number): Promise<RetrievedDBTransactionListData[] | void> {
	try {
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

		return outgoingTransactionsList.map(transaction => ({
			...transaction,
			recipient_public_key: transaction.is_recipient_fortuna_wallet ? undefined : transaction.recipient_public_key,
			username: transaction.is_recipient_fortuna_wallet ? transaction.recipient_solana_wallet?.user.username : undefined
		}))
	} catch (error) {
		console.error(error)
	}
}
