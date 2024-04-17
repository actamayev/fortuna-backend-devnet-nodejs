export default function transformOwnershipList(input: RetrievedMyOwnershipData[]): MyOwnershipData[] {
	return input.map( item => ({
		splPublicKey: item.spl_public_key,
		numberOfShares: item.number_of_shares
	}))
}
