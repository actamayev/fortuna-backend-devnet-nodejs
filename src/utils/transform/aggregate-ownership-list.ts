import _ from "lodash"

export default function aggregateOwnershipList(splOwnerships: RetrievedMyOwnershipData[]): RetrievedMyOwnershipDataMap {
	try {
		const sharesMap = new Map<string, MyOwnershipDataInMap>()

		splOwnerships.forEach(splOwnership => {
			const publicKey = splOwnership.spl.public_key_address
			const existingEntry = sharesMap.get(publicKey)

			const newPurchaseData: PurchaseData = {
				number_of_shares: splOwnership.number_of_shares,
				purchase_price_per_share_usd: splOwnership.purchase_price_per_share_usd
			}

			if (!_.isUndefined(existingEntry)) {
				// If an entry exists, append new purchase data to the purchaseData array
				existingEntry.purchaseData.push(newPurchaseData)
			} else {
				// Create a new entry if none exists
				sharesMap.set(publicKey, {
					purchaseData: [newPurchaseData],
					spl: {
						public_key_address: publicKey,
						creator_wallet_id: splOwnership.spl.creator_wallet_id,
						spl_name: splOwnership.spl.spl_name,
						uploaded_image: {
							image_url: splOwnership.spl.uploaded_image.image_url,
							uuid: splOwnership.spl.uploaded_image.uuid
						}
					}
				})
			}
		})

		return sharesMap
	} catch (error) {
		console.error(error)
		throw error
	}
}
