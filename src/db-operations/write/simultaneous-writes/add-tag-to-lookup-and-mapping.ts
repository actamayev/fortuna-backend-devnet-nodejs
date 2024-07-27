import PrismaClientClass from "../../../classes/prisma-client"

export default async function addTagToLookupAndMapping(
	videoId: number,
	videoTag: string,
	userId: number
): Promise<number> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.$transaction(async (prisma) => {
			const videoTagLookup = await prisma.video_tag_lookup.create({
				data: {
					video_tag: videoTag,
					added_by_user_id: userId
				}
			})

			await prisma.video_tag_mapping.create({
				data: {
					video_id: videoId,
					video_tag_lookup_id: videoTagLookup.video_tag_lookup_id
				}
			})

			return videoTagLookup.video_tag_lookup_id
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
