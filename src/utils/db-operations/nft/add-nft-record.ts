import { nft } from "@prisma/client"
import { Nft } from "@metaplex-foundation/js"
import prismaClient from "../../../prisma-client"
import get51SolanaWalletFromSecretKey from "../../solana/get-51-solana-wallet-from-secret-key"

export default async function addNFTRecord (
	metadataJSONUrl: string,
	fileName: string,
	nftToAdd: Nft,
	uploadNFTData: UploadNFT
): Promise<nft | void> {
	try {
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()
		const addNFTResponse = await prismaClient.nft.create({
			data: {
				solana_wallet_id: fiftyoneWallet.publicKey, // TODO: find 51 crypto's wallet id
				meta_data_url: metadataJSONUrl,
				file_name: fileName,
				nft_name: nftToAdd.name,
				chain_address: nftToAdd.mint.address.toString(),
				meta_data_address: nftToAdd.metadataAddress.toString(),
				// FUTURE TODO: Create a separate endpoint that allows for future Listing
				// ie. if a creator wants to mint before-hand, and release at the same time as the video drops. This would be "PRELISTING"
				nft_listing_status: "LISTED",
				listing_price: uploadNFTData.offeringSharePrice,
				description: uploadNFTData.description
			}
		})

		return addNFTResponse
	} catch (error) {
		console.error(error)
	}
}
