import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateVideoName(videoId: number, videoName: string): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.video.update({
			where: {
				video_id: videoId
			},
			data: {
				video_name: videoName
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
