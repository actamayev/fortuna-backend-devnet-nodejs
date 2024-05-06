import prismaClient from "../../../../classes/prisma-client"

export default async function addLoginHistoryRecord(userId: number): Promise<void> {
	try {
		await prismaClient.login_history.create({
			data: {
				user_id: userId
			}
		})
	} catch (error) {
		console.error("Error adding login record:", error)
		throw error
	}
}
