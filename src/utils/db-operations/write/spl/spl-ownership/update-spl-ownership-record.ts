import prismaClient from "../../../../../prisma-client"

export default async function updateSplOwnershipRecord(
	splId: number,
	tokenAccountId: number,
	numberOfSharesToChangeBy: number,
	addOrSubtractShares: "add" | "subtract"
): Promise<void> {
	try {
		const updateAmount = addOrSubtractShares === "add" ? numberOfSharesToChangeBy : -numberOfSharesToChangeBy
		await prismaClient.spl_ownership.update({
			where: {
				spl_id_token_account_id: {
					spl_id: splId,
					token_account_id: tokenAccountId
				}
			},
			data: {
				number_of_shares: {
					increment: updateAmount
				}
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
