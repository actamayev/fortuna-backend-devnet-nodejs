import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveCreatorContentList(solanaWalletId: number): Promise<RetrievedDBVideoData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const creatorVideoData = await prismaClient.video.findMany({
			where: {
				creator_wallet_id: solanaWalletId,
				video_listing_status: {
					notIn: ["PRELISTING", "REMOVED"]
				}
			},
			orderBy: {
				created_at: "desc"
			},
			select: {
				video_id: true,
				video_name: true,
				video_listing_status: true,
				description: true,
				uuid: true,
				uploaded_image: {
					select: {
						image_url: true
					}
				},

			}
		})

		return creatorVideoData
	} catch (error) {
		console.error(error)
		throw error
	}
}
