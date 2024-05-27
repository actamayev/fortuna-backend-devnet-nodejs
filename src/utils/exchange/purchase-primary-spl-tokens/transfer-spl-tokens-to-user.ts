import SecretsManager from "../../../classes/secrets-manager"
import EscrowWalletManager from "../../../classes/escrow-wallet-manager"
import updateSplListingStatus from "../../../db-operations/write/spl/update-spl-listing-status"
import retrieveSplOwnershipByWalletIdAndSplPublicKey
	from "../../../db-operations/read/spl-ownership/retrieve-spl-ownership-by-wallet-id-and-spl-public-key"
import addSplTransferRecordAndUpdateOwnership from "../../../db-operations/write/simultaneous-writes/add-spl-transfer-and-update-ownership"

export default async function transferSplTokensToUser(
	solanaWalletTransferringTo: ExtendedSolanaWallet,
	purchaseSplTokensData: PurchasePrimarySPLTokensData,
	splDetails: SplByPublicKeyData
): Promise<number> {
	try {
		const fortunaEscrowSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB")
		const splOwnerships = await retrieveSplOwnershipByWalletIdAndSplPublicKey(
			parseInt(fortunaEscrowSolanaWalletIdDb, 10),
			splDetails.publicKeyAddress
		)

		const splTransferId = await addSplTransferRecordAndUpdateOwnership(
			splDetails.splId,
			solanaWalletTransferringTo.solana_wallet_id,
			parseInt(fortunaEscrowSolanaWalletIdDb, 10),
			true,
			purchaseSplTokensData.numberOfTokensPurchasing,
			splDetails.listingSharePriceUsd,
			// There should just be one item in the array (escrow should just have 1 ownership record of each spl):
			splOwnerships[0].spl_ownership_id
		)

		const tokensRemainingInEscrow = await EscrowWalletManager.getInstance().decrementTokenAmount(
			purchaseSplTokensData.splPublicKey,
			purchaseSplTokensData.numberOfTokensPurchasing
		)

		if (tokensRemainingInEscrow === 0) await updateSplListingStatus(splDetails.splId, "SOLDOUT")

		return splTransferId
	} catch (error) {
		console.error(error)
		throw error
	}
}
