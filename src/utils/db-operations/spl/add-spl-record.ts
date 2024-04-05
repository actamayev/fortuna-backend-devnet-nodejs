import { PublicKey } from "@solana/web3.js"
import prismaClient from "../../../prisma-client"

export default async function addSPLRecord (
	metadataJSONUrl: string,
	newSPLData: NewSPLData,
	createSPLResponse: { mint: PublicKey, metadataTransactionSignature: string, feeInSol: number },
	creatorWalletId: number,
	fortunaWalletId: number,
	solPriceInUSD: number
): Promise<number | void> {
	try {
		const addSPLResponse = await prismaClient.spl.create({
			data: {
				meta_data_url: metadataJSONUrl,
				file_name: newSPLData.fileName,
				spl_name: newSPLData.splName,
				meta_data_address: createSPLResponse.metadataTransactionSignature,
				public_key_address: createSPLResponse.mint.toString(),
				listing_price_per_share_sol: newSPLData.offeringSharePriceSol,
				initial_creator_ownership_percentage: newSPLData.creatorOwnershipPercentage,

				total_number_of_shares: newSPLData.numberOfShares,
				creator_wallet_id: creatorWalletId,
				uploaded_image_id: newSPLData.uploadedImageId,

				spl_creation_fee_sol: createSPLResponse.feeInSol,
				spl_creation_fee_usd: createSPLResponse.feeInSol * solPriceInUSD,
				create_spl_payer_solana_wallet_id: fortunaWalletId,

				// The metadata creation fees are 0. When the meta data is set, a transaction signature is returned. See createTokenMetadata
				// When the fee for this signature is determined (by using the logic in calculate-tranaction-fee, it returns 5*10^-6 sol).
				// However, the wallet balance doesn't change (when comparing the before and after balance of the wallet)!
				// For the database to be consistent with the wallet, the spl_metadata creation fee is set to 0 here.
				spl_metadata_creation_fee_sol: 0,
				spl_metadata_creation_fee_usd: 0,
				create_spl_metadata_payer_solana_wallet_id: fortunaWalletId,

				spl_listing_status: "LISTED",
				description: newSPLData.description,
			}
		})

		return addSPLResponse.spl_id
	} catch (error) {
		console.error(error)
	}
}
