import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveMostPopularChannels(): Promise<number[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const videoLikes = await prismaClient.video_like_status.groupBy({
			by: ["video_id"],
			_count: {
				_all: true
			},
			where: {
				is_active: true
			}
		})

		// Step 2: Sum the likes for each creator
		const creatorLikes = await prismaClient.video.findMany({
			where: {
				video_id: {
					in: videoLikes.map(v => v.video_id)
				}
			},
			select: {
				creator_user_id: true,
				_count: {
					select: {
						video_like_status: true
					}
				}
			}
		})

		// Sum likes per creator
		const creatorLikeCounts: { [key: number]: number } = {}
		creatorLikes.forEach(video => {
			const likes = video._count.video_like_status
			if (creatorLikeCounts[video.creator_user_id]) {
				creatorLikeCounts[video.creator_user_id] += likes
			} else {
				creatorLikeCounts[video.creator_user_id] = likes
			}
		})

		const topCreatorIds = Object.entries(creatorLikeCounts)
			.sort(([, a], [, b]) => b - a)
			.map(([creatorId]) => parseInt(creatorId))

		return topCreatorIds
	} catch (error) {
		console.error(error)
		throw error
	}
}
