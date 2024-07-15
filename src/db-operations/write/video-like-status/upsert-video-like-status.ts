import PrismaClientClass from "../../../classes/prisma-client"

export default async function upsertVideoLike(videoId: number, userId: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.video_like_status.upsert({
			where: {
				video_id_user_id: {
					video_id: videoId,
					user_id: userId
				}
			},
			update: {
				is_active: true
			},
			create: {
				video_id: videoId,
				user_id: userId
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
