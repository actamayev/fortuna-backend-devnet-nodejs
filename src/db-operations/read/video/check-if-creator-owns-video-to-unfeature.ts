import PrismaClientClass from "../../../classes/prisma-client"

export default async function checkIfCreatorOwnsVideoToUnfeature(
	videoIdToUnfeature: number,
	creatorId: number
): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const numberOfVideos = await prismaClient.video.count({
			where: {
				video_id: videoIdToUnfeature,
				creator_user_id: creatorId
			}
		})

		return numberOfVideos !== 0
	} catch (error) {
		console.error(error)
		throw error
	}
}
