import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateVideoFeatureStatuses(
	videoIdToFeature: number,
	videoIdToUnfeature?: number
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const updateOperations = [
			prismaClient.video.update({
				where: {
					video_id: videoIdToFeature
				},
				data: {
					is_video_featured: true
				}
			})
		]

		if (videoIdToUnfeature !== undefined) {
			updateOperations.push(
				prismaClient.video.update({
					where: {
						video_id: videoIdToUnfeature
					},
					data: {
						is_video_featured: false
					}
				})
			)
		}

		await prismaClient.$transaction(updateOperations)
	} catch (error) {
		console.error(error)
		throw error
	}
}
