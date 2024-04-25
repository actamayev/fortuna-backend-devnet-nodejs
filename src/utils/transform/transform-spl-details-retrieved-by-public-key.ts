export default function transformSplDetailsRetrievedByPublicKey(
	splData: RetrievedSplByPublicKeyData
): SplByPublicKeyData {
	try {
		return {
			splName: splData.spl_name,
			splId: splData.spl_id,
			publicKeyAddress: splData.public_key_address,
			listingPricePerShareSol: splData.listing_price_per_share_sol,
			listingPricePerShareUsd: splData.listing_price_per_share_usd,
			totalNumberOfShares: splData.total_number_of_shares,
			creatorWalletId: splData.creator_wallet_id,
			imageUrl: splData.uploaded_image.image_url,
			uuid: splData.uploaded_image.uuid
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
