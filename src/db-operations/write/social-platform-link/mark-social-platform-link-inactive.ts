import { SocialPlatforms } from "@prisma/client"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function markSocialPlatformLinkInactive(
	userId: number,
	socialPlatform: SocialPlatforms
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.social_platform_link.update({
			where: {
				user_id_social_platform: {
					user_id: userId,
					social_platform: socialPlatform
				}
			},
			data: {
				is_active: false
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
