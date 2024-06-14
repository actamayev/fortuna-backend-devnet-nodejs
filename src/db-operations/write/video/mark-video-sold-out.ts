import PrismaClientClass from "../../../classes/prisma-client"

export default async function markVideoSoldOut(videoId: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.video.update({
			where: {
				video_id: videoId
			},
			data: {
				video_listing_status: "SOLDOUT"
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
