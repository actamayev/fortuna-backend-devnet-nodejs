import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateUnfeatureVideo(videoId: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.video.update({
			where: {
				video_id: videoId
			},
			data: {
				is_video_featured: false
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
