import { spl } from "@prisma/client"
import { PublicKey } from "@solana/web3.js"
import prismaClient from "../../../prisma-client"

// eslint-disable-next-line max-params
export default async function addSPLRecord (
	metadataJSONUrl: string,
	newSPLData: NewSPLData,
	createSPLResponse: { mint: PublicKey, metadataTransactionSignature: string },
	creatorWalletId: number,
	fiftyoneCryptoWalletId: number,
	feeInSol: number,
	solPriceInUSD: number
): Promise<spl | void> {
	try {
		const addSPLResponse = await prismaClient.spl.create({
			data: {
				meta_data_url: metadataJSONUrl,
				file_name: newSPLData.fileName,
				spl_name: newSPLData.splName,
				meta_data_address: createSPLResponse.metadataTransactionSignature,
				public_key_address: createSPLResponse.mint.toString(),
				listing_price_per_share_sol: newSPLData.offeringSharePrice,
				total_number_of_shares: newSPLData.numberOfShares,
				creator_wallet_id: creatorWalletId,
				uploaded_image_id: newSPLData.uploadedImageId,

				spl_creation_fee_sol: feeInSol,
				spl_creation_fee_usd: feeInSol * solPriceInUSD,
				create_spl_payer_solana_wallet_id: fiftyoneCryptoWalletId,

				spl_listing_status: "LISTED",
				description: newSPLData.description,
			}
		})

		return addSPLResponse
	} catch (error) {
		console.error(error)
	}
}
