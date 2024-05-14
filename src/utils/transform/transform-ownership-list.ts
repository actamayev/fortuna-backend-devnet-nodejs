export default function transformOwnershipList(ownershipMap: RetrievedMyOwnershipDataMap, userWalletId: number): MyOwnershipData[] {
	try {
		return Array.from(ownershipMap.values()).map(item => ({
			splName: item.spl.spl_name,
			splPublicKey: item.spl.public_key_address,
			numberOfShares: item.number_of_shares,
			imageUrl: item.spl.uploaded_image.image_url,
			uuid: item.spl.uploaded_image.uuid,
			isMyContent: item.spl.creator_wallet_id === userWalletId
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
