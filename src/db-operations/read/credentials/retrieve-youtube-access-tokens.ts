import _ from "lodash"
import PrismaClientClass from "../../../classes/prisma-client"
import { validateYouTubeTokenData } from "../../../utils/types/type-guards"

export default async function retrieveYouTubeAccessTokens(userId: number): Promise<TypedRetrievedYouTubeAccessTokensData | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const accessTokenData = await prismaClient.credentials.findUnique({
			where: {
				user_id: userId
			},
			select: {
				youtube_access_tokens: {
					select: {
						access_token: true,
						refresh_token__encrypted: true,
						expiry_date: true
					}
				}
			}
		})

		if (_.isNull(accessTokenData) || _.isNull(accessTokenData.youtube_access_tokens)) return null

		if (validateYouTubeTokenData(accessTokenData.youtube_access_tokens) === false) {
			return null
		}
		return accessTokenData.youtube_access_tokens
	} catch (error) {
		console.error(error)
		throw error
	}
}
