import prismaClient from "../../../prisma-client"

export default async function addSPLOwnershipRecord (
	newSplId: number,
	tokenAccountId: number,
	numberOfShares: number
): Promise<void> {
	try {
		await prismaClient.spl_ownership.create({
			data: {
				spl_id: newSplId,
				token_account_id: tokenAccountId,
				number_of_shares: numberOfShares
			}
		})
	} catch (error) {
		console.error(error)
	}
}
