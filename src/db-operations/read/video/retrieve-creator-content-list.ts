import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveCreatorContentList(solanaWalletId: number): Promise<RetrievedCreatorDBVideoData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const creatorVideoData = await prismaClient.video.findMany({
			where: {
				creator_wallet_id: solanaWalletId
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
				is_video_exclusive: true,
				uploaded_image: {
					select: {
						image_url: true
					}
				},
				video_access_tier: {
					select: {
						tier_number: true,
						purchases_allowed_for_this_tier: true,
						percent_discount_at_this_tier: true,
						tier_access_price_usd: true,
						is_sold_out: true
					}
				},
				_count: {
					select: {
						exclusive_video_access_purchase: true
					}
				}
			}
		})

		const filteredVideo = creatorVideoData
			.map(video => ({
				...video,
				numberOfExclusivePurchasesSoFar: video.is_video_exclusive ? video._count.exclusive_video_access_purchase : null
			}))
			// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
			.map(({ _count, ...rest }) => rest) // Remove _count property

		return filteredVideo as RetrievedCreatorDBVideoData[]
	} catch (error) {
		console.error(error)
		throw error
	}
}
