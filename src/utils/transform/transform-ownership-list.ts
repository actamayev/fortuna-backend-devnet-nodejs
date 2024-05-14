export default function transformOwnershipList(ownershipMap: RetrievedMyOwnershipDataMap, userWalletId: number): MyOwnershipData[] {
	try {
		return Array.from(ownershipMap.values()).map(item => ({
			splPublicKey: item.spl.public_key_address,
			purchaseData: item.purchaseData,
			imageUrl: item.spl.uploaded_image.image_url,
			uuid: item.spl.uploaded_image.uuid,
			isMyContent: item.spl.creator_wallet_id === userWalletId,
			splName: item.spl.spl_name
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
