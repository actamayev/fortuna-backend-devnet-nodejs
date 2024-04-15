import _ from "lodash"
import prismaClient from "../../../../prisma-client"

export default async function retrieveSplByPublicKey(
	splPublicKey: string
): Promise<RetrieveSplByPublicKey | null> {
	try {
		const creatorSPLData = await prismaClient.spl.findFirst({
			where: {
				public_key_address: splPublicKey
			},
			select: {
				spl_id: true,
				public_key_address: true,
				total_number_of_shares: true,
				listing_price_per_share_sol: true
			}
		})

		if (_.isNull(creatorSPLData)) return null
		return {
			splId: creatorSPLData.spl_id,
			publicKeyAddress: creatorSPLData.public_key_address,
			listingPricePerShareSol: creatorSPLData.listing_price_per_share_sol,
			totalNumberOfShares: creatorSPLData.total_number_of_shares
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
