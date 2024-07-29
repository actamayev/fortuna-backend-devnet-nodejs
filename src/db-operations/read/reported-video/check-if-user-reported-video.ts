import PrismaClientClass from "../../../classes/prisma-client"

export default async function checkIfUserReportedVideo(userId: number, videoId: number): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		const walletExists = await prismaClient.reported_video.findUnique({
			where: {
				video_id_user_id_who_reported_video: {
					user_id_who_reported_video: userId,
					video_id: videoId
				}
			}
		})

		return walletExists !== null
	} catch (error) {
		console.error(error)
		throw error
	}
}
