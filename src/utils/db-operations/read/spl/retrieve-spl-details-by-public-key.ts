import prismaClient from "../../../../prisma-client"

export default async function retrieveSplDetailsByPublicKey(
	splPublicKey: string
): Promise<RetrievedSplByPublicKeyData | null> {
	try {
		const creatorSPLData = await prismaClient.spl.findFirst({
			where: {
				public_key_address: splPublicKey
			},
			select: {
				spl_name: true,
				spl_id: true,
				public_key_address: true,
				total_number_of_shares: true,
				listing_price_per_share_sol: true,
				creator_wallet_id: true,
				uploaded_image: {
					select: {
						uuid: true,
						image_url: true
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
