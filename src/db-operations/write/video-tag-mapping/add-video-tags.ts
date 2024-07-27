import PrismaClientClass from "../../../classes/prisma-client"

export default async function addVideoTags(
	videoTagLookupIds: number[],
	videoId: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		// Prepare the data for batch insertion
		const data = videoTagLookupIds.map(videoTagLookupId => ({
			video_tag_lookup_id: videoTagLookupId,
			video_id: videoId
		}))

		// Perform the batch insertion
		await prismaClient.video_tag_mapping.createMany({
			data: data,
			skipDuplicates: true
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
