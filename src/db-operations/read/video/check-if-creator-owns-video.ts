import PrismaClientClass from "../../../classes/prisma-client"

export default async function checkIfCreatorOwnsVideo(
	videoId: number,
	creatorId: number
): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const video = await prismaClient.video.findFirst({
			where: {
				video_id: videoId,
				creator_user_id: creatorId
			},
			select: {
				video_id: true
			}
		})

		return video !== null
	} catch (error) {
		console.error(error)
		throw error
	}
}
