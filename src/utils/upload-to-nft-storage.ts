import { NFTStorage, Blob } from "nft.storage"
import { Tagged } from "nft.storage/dist/src/lib/interface"

export default async function uploadToNFTStorage (
	fileBuffer: Buffer,
	fileName: string
): Promise<Tagged<string, URL> | undefined> {
	try {
		const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY })

		const blob = new Blob([fileBuffer], { type: "image/png" })

		const metadata = await client.store({
			name: "Tiger 1",
			description: "A Tiger",
			image: blob,
			// properties: {
			// 	originalFileName: fileName
			// }
		})

		return metadata.url
	} catch (error) {
		console.error(error)
	}
}
