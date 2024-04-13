import prismaClient from "../../../../prisma-client"

export default async function doesUsernameExist(username: string): Promise<boolean | undefined> {
	try {
		const user = await prismaClient.credentials.findFirst({
			where: {
				username: {
					equals: username,
					mode: "insensitive"
				}
			}
		})
		return user !== null
	} catch (error) {
		return undefined
	}
}

