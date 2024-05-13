import SecretsManager from "../../../classes/secrets-manager"
import EscrowWalletManager from "../../../classes/escrow-wallet-manager"
import updateSplListingStatus from "../../../db-operations/write/spl/update-spl-listing-status"
import addSplTransferRecordAndUpdateOwnership from "../../../db-operations/write/simultaneous-writes/add-spl-transfer-and-update-ownership"

export default async function transferSplTokensToUser(
	solanaWallet: ExtendedSolanaWallet,
	purchaseSplTokensData: PurchasePrimarySPLTokensData,
	splId: number
): Promise<number> {
	try {
		const fortunaEscrowSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB")
		const splTransferId = await addSplTransferRecordAndUpdateOwnership(
			splId,
			solanaWallet.solana_wallet_id,
			parseInt(fortunaEscrowSolanaWalletIdDb, 10),
			true,
			false,
			purchaseSplTokensData.numberOfTokensPurchasing,
		)

		const tokensRemainingInEscrow = await EscrowWalletManager.getInstance().decrementTokenAmount(
			purchaseSplTokensData.splPublicKey,
			purchaseSplTokensData.numberOfTokensPurchasing
		)

		if (tokensRemainingInEscrow === 0) await updateSplListingStatus(splId, "SOLDOUT")

		return splTransferId
	} catch (error) {
		console.error(error)
		throw error
	}
}
