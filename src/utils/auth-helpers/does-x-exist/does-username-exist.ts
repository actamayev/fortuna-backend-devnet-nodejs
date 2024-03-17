import prismaClient from "../../../prisma-client"

export default async function doesUsernameExist(username: string): Promise<boolean> {
	const user = await prismaClient.credentials.findFirst({
		where: {
			username: {
				equals: username,
				mode: "insensitive"
			},
		},
	})
	return user !== null
}

