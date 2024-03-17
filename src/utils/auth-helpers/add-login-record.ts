import prismaClient from "../../prisma-client"

export default async function addLoginRecord(userId: number): Promise<void> {
	try {
		await prismaClient.loginHistory.create({
			data: {
				user_id: userId,
			},
		})
	} catch (error) {
		console.error("Error adding login record:", error)
	}
}
