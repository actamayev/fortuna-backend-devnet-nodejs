import _ from "lodash"

export default function aggregateOwnershipList(splOwnerships: RetrievedMyOwnershipData[]): RetrievedMyOwnershipDataMap {
	try {
		const sharesMap = new Map<string, RetrievedMyOwnershipData>()

		splOwnerships.forEach(splOwnership => {
			const publicKey = splOwnership.spl.public_key_address
			const existingEntry = sharesMap.get(publicKey)

			if (!_.isUndefined(existingEntry)) {
				// If an entry exists, increment the shares
				existingEntry.number_of_shares += splOwnership.number_of_shares
			} else {
				// Create a new entry if none exists
				sharesMap.set(publicKey, {
					number_of_shares: splOwnership.number_of_shares,
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
