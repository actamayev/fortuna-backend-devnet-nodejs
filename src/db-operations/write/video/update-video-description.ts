import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateVideoDescription(videoId: number, videoDescription: string): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.video.update({
			where: {
				video_id: videoId
			},
			data: {
				description: videoDescription
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
