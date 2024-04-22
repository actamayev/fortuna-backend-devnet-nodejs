import _ from "lodash"
import determineNumberOfTokensRemainingInEscrow from "../solana/determine-number-of-remaining-tokens-in-escrow"

export default async function transformHomePageVideoData(input: HomePageVideoRetrievedFromDB[]): Promise<VideoDataSendingToFrontend[]> {
	try {
		const results = await Promise.all(input.map(async (item) => {
			if (_.isNull(item.spl)) return undefined
			const sharesRemainingForSale = await determineNumberOfTokensRemainingInEscrow(item.spl.public_key_address)
			return {
				splName: item.spl.spl_name,
				splPublicKey: item.spl.public_key_address,
				offeringSharePriceSol: item.spl.listing_price_per_share_sol,
				offeringSharePriceUsd: item.spl.listing_price_per_share_usd,
				description: item.spl.description,
				imageUrl: item.spl.uploaded_image.image_url,
				videoUrl: item.video_url,
				uuid: item.uuid,
				totalNumberShares: item.spl.total_number_of_shares,
				sharesRemainingForSale,
				creatorUsername: item.spl.spl_creator_wallet.user.username
			}
		}))

		// Filter out any undefined entries from the results
		return results.filter((result): result is VideoDataSendingToFrontend => result !== undefined)
	} catch (error) {
		console.error(error)
		throw error
	}
}
