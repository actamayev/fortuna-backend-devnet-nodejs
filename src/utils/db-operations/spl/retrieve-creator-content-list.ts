import prismaClient from "../../../prisma-client"

export default async function retrieveCreatorContentList(solanaWalletId: number): Promise<RetrievedDBSplData[] | void> {
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
				description: true,
				initial_creator_ownership_percentage: true,
				uploaded_image: {
					select: {
						image_url: true
					}
				},
				uploaded_video: {
					select: {
						video_url: true
					}
				},
				public_key_address: true
			}
		})

		return creatorSPLData
	} catch (error) {
		console.error(error)
	}
}
