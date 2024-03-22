import { spl } from "@prisma/client"
import { PublicKey } from "@solana/web3.js"
import prismaClient from "../../../prisma-client"

export default async function addSPLRecord (
	metadataJSONUrl: string,
	newSPLData: NewSPLData,
	splTokenPublicKey: PublicKey,
	creatorWalletId: number
): Promise<spl | void> {
	try {
		// TODO: Fix the blank fields
		const addSPLResponse = await prismaClient.spl.create({
			data: {
				meta_data_url: metadataJSONUrl,
				file_name: newSPLData.fileName,
				spl_name: newSPLData.splName,
				chain_address: "",
				meta_data_address: "",
				public_key_address: splTokenPublicKey.toString(),
				listing_price: newSPLData.offeringSharePrice,
				blockchain_mint_fee: 0,
				payer_solana_wallet_id: 0,
				total_number_of_shares: newSPLData.numberOfShares,
				description: newSPLData.description,
				spl_listing_status: "LISTED",
				creator_wallet_id: creatorWalletId
			}
		})

		return addSPLResponse
	} catch (error) {
		console.error(error)
	}
}
