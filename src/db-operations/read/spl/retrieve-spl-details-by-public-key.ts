import PrismaClientClass from "../../../classes/prisma-client"

export default async function retrieveSplDetailsByPublicKey(
	splPublicKey: string
): Promise<RetrievedSplByPublicKeyData | null> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const creatorSPLData = await prismaClient.spl.findFirst({
			where: {
				public_key_address: splPublicKey
			},
			select: {
				spl_name: true,
				spl_id: true,
				public_key_address: true,
				total_number_of_shares: true,
				listing_price_per_share_usd: true,
				spl_listing_status: true,
				creator_wallet_id: true,
				is_spl_exclusive: true,
				value_needed_to_access_exclusive_content_usd: true,
				listing_price_to_access_exclusive_content_usd: true,
				allow_value_from_same_creator_tokens_for_exclusive_content: true,
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
