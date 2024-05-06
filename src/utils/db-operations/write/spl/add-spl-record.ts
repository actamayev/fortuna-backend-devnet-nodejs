import prismaClient from "../../../../classes/prisma-client"
import SecretsManager from "../../../../classes/secrets-manager"
import SolPriceManager from "../../../../classes/sol-price-manager"

// eslint-disable-next-line max-lines-per-function
export default async function addSPLRecord (
	metadataJSONUrl: string,
	newSPLData: IncomingNewSPLData,
	createSPLResponse: CreateSPLResponse,
	creatorWalletId: number
): Promise<number> {
	try {
		const solPriceDetails = await SolPriceManager.getInstance().getPrice()
		const fortunaSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_SOLANA_WALLET_ID_DB")
		const feePayerSolanaWalletId = parseInt(fortunaSolanaWalletIdDb, 10)

		const addSPLResponse = await prismaClient.spl.create({
			data: {
				meta_data_url: metadataJSONUrl,
				spl_name: newSPLData.splName,
				meta_data_address: createSPLResponse.metadataTransactionSignature,
				public_key_address: createSPLResponse.mint.toString(),
				listing_price_per_share: newSPLData.listingSharePrice,
				listing_currency_peg: newSPLData.listingDefaultCurrency,
				initial_creator_ownership_percentage: newSPLData.creatorOwnershipPercentage,

				total_number_of_shares: newSPLData.numberOfShares,
				creator_wallet_id: creatorWalletId,
				uploaded_image_id: newSPLData.uploadedImageId,
				uploaded_video_id: newSPLData.uploadedVideoId,

				spl_creation_fee_sol: createSPLResponse.feeInSol,
				spl_creation_fee_usd: createSPLResponse.feeInSol * solPriceDetails.price,
				create_spl_fee_payer_solana_wallet_id: feePayerSolanaWalletId,

				// The metadata creation fees are 0. When the meta data is set, a transaction signature is returned. See createTokenMetadata
				// When the fee for this signature is determined (by using the logic in calculate-tranaction-fee, it returns 5*10^-6 sol).
				// However, the wallet balance doesn't change (when comparing the before and after balance of the wallet)!
				// For the database to be consistent with the wallet, the spl_metadata creation fee is set to 0 here.
				spl_metadata_creation_fee_sol: 0,
				spl_metadata_creation_fee_usd: 0,
				create_spl_metadata_fee_payer_solana_wallet_id: feePayerSolanaWalletId,

				spl_listing_status: "LISTED",
				description: newSPLData.description,
				original_content_url: newSPLData.originalContentUrl
			}
		})

		return addSPLResponse.spl_id
	} catch (error) {
		console.error(error)
		throw error
	}
}
