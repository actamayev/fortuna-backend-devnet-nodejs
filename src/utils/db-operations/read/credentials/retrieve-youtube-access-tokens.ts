import _ from "lodash"
import prismaClient from "../../../../prisma-client"

export default async function retrieveYouTubeAccessTokens(userId: number): Promise<RetrievedYouTubeAccessTokensData | null> {
	try {
		const accessTokenData = await prismaClient.credentials.findFirst({
			where: {
				user_id: userId
			},
			select: {
				youtube_access_tokens: {
					select: {
						access_token: true,
						refresh_token: true,
						expiry_date: true
					}
				}
			}
		})

		if (_.isNull(accessTokenData) || _.isNull(accessTokenData.youtube_access_tokens)) return null

		return accessTokenData.youtube_access_tokens
	} catch (error) {
		console.error(error)
		throw error
	}
}
