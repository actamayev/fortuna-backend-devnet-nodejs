import PrismaClientClass from "../../../classes/prisma-client"

export default async function upsertVideoTag(
	videoId: number,
	videoTagId: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.video_tag_mapping.upsert({
			where: {
				video_tag_lookup_id_video_id: {
					video_tag_lookup_id: videoTagId,
					video_id: videoId
				}
			},
			update: {
				is_active: true
			},
			create: {
				video_tag_lookup_id: videoTagId,
				video_id: videoId
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
