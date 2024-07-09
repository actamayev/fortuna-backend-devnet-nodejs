import { VideoListingStatus } from "@prisma/client"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function setNewVideoListingStatus(
	videoId: number,
	newVideoListingStatus: VideoListingStatus
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.video.update({
			where: {
				video_id: videoId
			},
			data: {
				video_listing_status: newVideoListingStatus
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
