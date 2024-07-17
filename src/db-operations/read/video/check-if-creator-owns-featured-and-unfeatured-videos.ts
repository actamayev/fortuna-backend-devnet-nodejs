import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line complexity
export default async function checkIfCreatorOwnsFeaturedAndUnfeaturedVideos(
	videoIdToFeature: number,
	videoIdToUnfeature: number | undefined,
	creatorId: number
): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const videos = await prismaClient.video.findMany({
			where: {
				video_id: {
					in: videoIdToUnfeature !== undefined ? [videoIdToFeature, videoIdToUnfeature] : [videoIdToFeature]
				},
				creator_user_id: creatorId
			},
			select: {
				video_id: true
			}
		})

		// Determine the results based on the conditions
		const hasFeatureVideo = videos.some(video => video.video_id === videoIdToFeature)
		const hasUnFeatureVideo = videoIdToUnfeature !== undefined && videos.some(video => video.video_id === videoIdToUnfeature)

		if (hasFeatureVideo && (!videoIdToUnfeature || hasUnFeatureVideo)) {
			return true
		} else if (hasFeatureVideo && videoIdToUnfeature && !hasUnFeatureVideo) {
			return false
		}

		return false
	} catch (error) {
		console.error(error)
		throw error
	}
}
