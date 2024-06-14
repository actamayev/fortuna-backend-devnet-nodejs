import { Credentials } from "google-auth-library"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateYouTubeAccessToken(
	youtubeAccessTokensId: number,
	credentials: Credentials
): Promise<string> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const youtubeAccessTokensData = await prismaClient.youtube_access_tokens.update({
			where: {
				youtube_access_tokens_id: youtubeAccessTokensId
			},
			data: {
				access_token: credentials.access_token as string,
				expiry_date: new Date(credentials.expiry_date as number)
			}
		})

		return youtubeAccessTokensData.access_token
	} catch (error) {
		console.error(error)
		throw error
	}
}
