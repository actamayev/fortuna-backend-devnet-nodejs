import { spl } from "@prisma/client"
import { PublicKey } from "@solana/web3.js"
import prismaClient from "../../../prisma-client"

export default async function addSPLRecord (
	newNft: nft,
	splTokenPublicKey: PublicKey
): Promise<spl | void> {
	try {
		const addSPLResponse = await prismaClient.spl.create({
			data: {
				nft_id: newNft.nft_id,
				public_key_address: splTokenPublicKey.toString()
			}
		})

		return addSPLResponse
	} catch (error) {
		console.error(error)
	}
}

// export default async function addNFTRecord (
// 	metadataJSONUrl: string,
// 	fileName: string,
// 	nftToAdd: Nft,
// 	uploadNFTData: UploadSPL
// ): Promise<nft | void> {
// 	try {
// 		const fiftyoneWallet = get51SolanaWalletFromSecretKey()
// 		const addNFTResponse = await prismaClient.nft.create({
// 			data: {
// 				solana_wallet_id: fiftyoneWallet.publicKey, // TODO: find 51 crypto's wallet id
// 				meta_data_url: metadataJSONUrl,
// 				file_name: fileName,
// 				nft_name: nftToAdd.name,
// 				chain_address: nftToAdd.mint.address.toString(),
// 				meta_data_address: nftToAdd.metadataAddress.toString(),
// 				// FUTURE TODO: Create a separate endpoint that allows for future Listing
// 				// ie. if a creator wants to mint before-hand, and release at the same time as the video drops. This would be "PRELISTING"
// 				nft_listing_status: "LISTED",
// 				listing_price: uploadNFTData.offeringSharePrice,
// 				description: uploadNFTData.description
// 			}
// 		})

// 		return addNFTResponse
// 	} catch (error) {
// 		console.error(error)
// 	}
// }
