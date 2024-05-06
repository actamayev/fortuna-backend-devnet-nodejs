import prismaClient from "../../../../classes/prisma-client"

export default async function setUsername(userId: number, username: string): Promise<void> {
	try {
		await prismaClient.credentials.update({
			where: {
				user_id: userId
			},
			data: {
				username
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
