import PrismaClientClass from "../../../classes/prisma-client"

export default async function removeLike(videoId: number, userId: number): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.video_like_status.update({
			where: {
				video_id_user_id: {
					video_id: videoId,
					user_id: userId
				}
			},
			data: {
				is_active: false
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
