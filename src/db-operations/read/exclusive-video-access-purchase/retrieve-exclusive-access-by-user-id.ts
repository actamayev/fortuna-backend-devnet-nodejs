import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveExclusiveAccessByUserId(
	userId: number
): Promise<RetrievedMyExclusiveContentData[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

		return await prismaClient.exclusive_video_access_purchase.findMany({
			where: {
				user_id: userId
			},
			select: {
				created_at: true,
				video: {
					select: {
						video_name: true,
						uuid: true,
						uploaded_image: {
							select: {
								image_url: true
							}
						},
						uploaded_video: {
							select: {
								video_duration_seconds: true
							}
						},
						video_creator: {
							select: {
								username: true,
								profile_picture: {
									select: {
										image_url: true
									},
									where: {
										is_active: true
									}
								},
								channel_name: {
									select: {
										channel_name: true
									}
								}
							}
						}
					}
				},
				exclusive_video_access_purchase_sol_transfer: {
					select: {
						sol_amount_transferred: true,
						usd_amount_transferred: true,
						sender_new_wallet_balance_sol: true,
						sender_new_wallet_balance_usd: true
					}
				},
				exclusive_video_access_purchase_fortuna_take: {
					select: {
						sol_amount_transferred: true,
						usd_amount_transferred: true
					}
				}
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
