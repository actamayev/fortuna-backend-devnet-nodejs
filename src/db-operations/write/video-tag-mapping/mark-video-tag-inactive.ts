import PrismaClientClass from "../../../classes/prisma-client"

export default async function markVideoTagInactive(videoId: number, videoTagId: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.video_tag_mapping.update({
			where: {
				video_tag_lookup_id_video_id: {
					video_tag_lookup_id: videoTagId,
					video_id: videoId
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
