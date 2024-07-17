import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveVideoIdByUUIDAndUserId(
	videoUUID: string,
	userId: number
): Promise<RetrievedVideoId | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.video.findFirst({
			where: {
				uuid: videoUUID,
				creator_user_id: userId,
				video_creator: {
					is_active: true
				}
			},
			select: {
				video_id: true
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
