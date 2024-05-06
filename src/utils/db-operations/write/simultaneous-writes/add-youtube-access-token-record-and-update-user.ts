import prismaClient from "../../../../prisma-client"

export default async function addYouTubeAccessTokenRecord (
	userId: number,
	accessToken: string,
	refreshToken: string,
	expiryDate: number
): Promise<void> {
	try {
		const expiryDateObject = new Date(expiryDate)
		await prismaClient.$transaction(async (prisma) => {
			const youtubeAccessToken = await prisma.youtube_access_tokens.create({
				data: {
					access_token: accessToken,
					refresh_token: refreshToken,
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
