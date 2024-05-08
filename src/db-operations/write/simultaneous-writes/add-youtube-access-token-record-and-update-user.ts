import PrismaClientClass from "../../../classes/prisma-client"

export default async function addYouTubeAccessTokenRecord (
	userId: number,
	accessToken: string,
	encryptedRefreshToken: NonDeterministicEncryptedString,
	expiryDate: number
): Promise<void> {
	try {
		const expiryDateObject = new Date(expiryDate)
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.$transaction(async (prisma) => {
			const youtubeAccessToken = await prisma.youtube_access_tokens.create({
				data: {
					access_token: accessToken,
					refresh_token__encrypted: encryptedRefreshToken,
					expiry_date: expiryDateObject
				}
			})

			await prisma.credentials.update({
				where: {
					user_id: userId
				},
				data: {
					youtube_access_tokens_id: youtubeAccessToken.youtube_access_tokens_id
				}
			})
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
