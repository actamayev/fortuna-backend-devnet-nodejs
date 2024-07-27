import PrismaClientClass from "../../../classes/prisma-client"


export default async function retrieveVideoTagIdByTagName(videoTag: string): Promise<number | undefined> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const videoTagLookup =  await prismaClient.video_tag_lookup.findFirst({
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

		return videoTagLookup?.video_tag_lookup_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
