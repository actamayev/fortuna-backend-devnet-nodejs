import prismaClient from "../../../../prisma-client"

export default async function retrieveIncomingTransactionsList(publicKey: string): Promise<RetrievedDBTransactionListData[] | void> {
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

		return incomingTransactionsList.map(transaction => ({
			...transaction,
			username: transaction.is_recipient_fortuna_wallet ? transaction.recipient_solana_wallet?.user.username : undefined
		}))
	} catch (error) {
		console.error(error)
	}
}
