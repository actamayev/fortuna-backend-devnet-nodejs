import prismaClient from "../../../../prisma-client"

export default async function retrieveCreatorContentList(solanaWalletId: number): Promise<RetrievedDBSplData[]> {
	try {
		const creatorSPLData = await prismaClient.spl.findMany({
			where: {
				creator_wallet_id: solanaWalletId
			},
			orderBy: {
				created_at: "desc"
			},
			select: {
				spl_id: true,
				spl_name: true,
				total_number_of_shares: true,
				listing_price_per_share_sol: true,
				listing_price_per_share_usd: true,
				description: true,
				initial_creator_ownership_percentage: true,
				public_key_address: true,
				uploaded_image: {
					select: {
						image_url: true
					}
				},
				uploaded_video: {
					select: {
						video_url: true,
						uuid: true
					}
				}
			}
		})

		return creatorSPLData
	} catch (error) {
		console.error(error)
		throw error
	}
}
