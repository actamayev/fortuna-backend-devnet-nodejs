import { SocialPlatforms } from "@prisma/client"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function upsertSocialPlatformLink(
	userId: number,
	socialLink: string,
	socialPlatform: SocialPlatforms
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.social_platform_link.upsert({
			where: {
				user_id_social_platform: {
					user_id: userId,
					social_platform: socialPlatform
				}
			},
			update: {
				social_link: socialLink,
				is_active: true
			},
			create: {
				user_id: userId,
				social_link: socialLink,
				social_platform: socialPlatform
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
