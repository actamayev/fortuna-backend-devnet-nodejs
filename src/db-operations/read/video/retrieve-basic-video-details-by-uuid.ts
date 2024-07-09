import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveBasicVideoDetailsByUUID(videoUUID: string): Promise<VideoDataNeededToEditVideoDetails | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.video.findFirst({
			where: {
				uuid: videoUUID
			},
			select: {
				video_id: true,
				creator_user_id: true
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
