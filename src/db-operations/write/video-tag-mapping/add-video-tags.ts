export default async function addVideoTags(
	prismaClient: PrismaType,
	videoTagLookupIds: number[],
	videoId: number
): Promise<void> {
	try {
		// Prepare the data for batch insertion
		const data = videoTagLookupIds.map(videoTagLookupId => ({
			video_tag_lookup_id: videoTagLookupId,
			video_id: videoId
		}))

		// Perform the batch insertion
		await prismaClient.video_tag_mapping.createMany({
			data,
			skipDuplicates: true
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
