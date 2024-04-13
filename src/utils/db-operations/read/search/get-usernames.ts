import prismaClient from "../../../../prisma-client"

export default async function getUsernames(
	username: string,
	excludeUsername: string
): Promise<{username: string}[]> {
	try {
		const usernames = await prismaClient.credentials.findMany({
			where: {
				AND: [ // Use AND to combine multiple conditions
					{ username: {
						contains: username,
						mode: "insensitive",
					}},
					{ username: {
						not: {
							equals: excludeUsername,
						},
					}},
				],
			},
			select: {
				username: true
			},
		})

		return usernames
	} catch (error) {
		console.error("Error adding login record:", error)
		throw error
	}
}
