import PrismaClientClass from "../../../classes/prisma-client"

interface VideoTagLookup {
	video_tag_lookup_id: number
}

export default async function retrieveVideoTagIdByTagName(videoTag: string): Promise<VideoTagLookup | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.video_tag_lookup.findFirst({
			where: {
				video_tag: {
					equals: videoTag,
					mode: "insensitive"
				}
			},
			select: {
				video_tag_lookup_id: true
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
