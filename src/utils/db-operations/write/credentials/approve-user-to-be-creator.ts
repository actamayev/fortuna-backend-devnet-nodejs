import prismaClient from "../../../../classes/prisma-client"

export default async function approveUserToBeCreator(userId: number): Promise<void> {
	try {
		await prismaClient.credentials.update({
			where: {
				user_id: userId
			},
			data: {
				is_approved_to_be_creator: true
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
