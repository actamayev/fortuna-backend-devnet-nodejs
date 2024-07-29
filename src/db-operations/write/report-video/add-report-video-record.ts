import PrismaClientClass from "../../../classes/prisma-client"

export default async function addReportVideoRecord (
	userIdThatsReporting: number,
	videoId: number,
	reportMesage?: string
): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		await prismaClient.reported_video.create({
			data: {
				user_id_who_reported_video: userIdThatsReporting,
				video_id: videoId,
				report_message: reportMesage
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
