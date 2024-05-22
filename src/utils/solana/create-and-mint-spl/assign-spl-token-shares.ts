import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import mintSPLHelper from "./mint-spl-helper"
import SecretsManager from "../../../classes/secrets-manager"
import createTokenAccountHelper from "./create-token-account-helper"
import GetKeypairFromSecretKey from "../get-keypair-from-secret-key"
import EscrowWalletManager from "../../../classes/escrow-wallet-manager"
import addSplOwnership from "../../../db-operations/write/spl/spl-ownership/add-spl-ownership"

// eslint-disable-next-line max-lines-per-function
export default async function assignSPLTokenShares (
	splTokenPublicKey: PublicKey,
	uploadSplData: IncomingNewSPLData,
	splId: number,
	creatorSolanaWalletId: number
): Promise<void> {
	try {
		const fortunaFeePayerWallet = await GetKeypairFromSecretKey.getFortunaFeePayerWalletKeypair()
		const {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
			FORTUNA_FEE_PAYER_PUBLIC_KEY,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			FORTUNA_FEE_PAYER_WALLET_ID_DB,
			FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_PUBLIC_KEY,
			FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB,
			FORTUNA_TOKENS_WALLET_PUBLIC_KEY,
			FORTUNA_TOKENS_WALLET_ID_DB
		} = await SecretsManager.getInstance().getSecrets([
			"FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_PUBLIC_KEY", "FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB",
			"FORTUNA_TOKENS_WALLET_PUBLIC_KEY", "FORTUNA_TOKENS_WALLET_ID_DB", "FORTUNA_FEE_PAYER_PUBLIC_KEY",
			"FORTUNA_FEE_PAYER_WALLET_ID_DB"
		])

		await createTokenAccountHelper(
			fortunaFeePayerWallet,
			splId,
			splTokenPublicKey,
			new PublicKey(FORTUNA_FEE_PAYER_PUBLIC_KEY),
			parseInt(FORTUNA_FEE_PAYER_WALLET_ID_DB, 10)
		)

		const escrowTokenAccountData = await createTokenAccountHelper(
			fortunaFeePayerWallet,
			splId,
			splTokenPublicKey,
			new PublicKey(FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_PUBLIC_KEY),
			parseInt(FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB, 10)
		)

		const fortunaTokensTokenAccountData = await createTokenAccountHelper(
			fortunaFeePayerWallet,
			splId,
			splTokenPublicKey,
			new PublicKey(FORTUNA_TOKENS_WALLET_PUBLIC_KEY),
			parseInt(FORTUNA_TOKENS_WALLET_ID_DB, 10)
		)

		const creatorShares = _.floor(uploadSplData.creatorOwnershipPercentage * uploadSplData.numberOfShares * 0.01)
		const fortunaSharesToMint = _.ceil(uploadSplData.numberOfShares * (0.01)) // 1% of the share count goes to Fortuna as a fee
		const escrowSharesToMint = uploadSplData.numberOfShares - creatorShares - fortunaSharesToMint

		// Mint SPLs:
		// To the Escrow TA
		await mintSPLHelper(
			fortunaFeePayerWallet,
			splTokenPublicKey,
			splId,
			fortunaFeePayerWallet.publicKey,
			escrowTokenAccountData.accountAddress,
			escrowSharesToMint,
			escrowTokenAccountData.tokenAccountIdDb,
			parseInt(FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB, 10)
		)

		await mintSPLHelper(
			fortunaFeePayerWallet,
			splTokenPublicKey,
			splId,
			fortunaFeePayerWallet.publicKey,
			fortunaTokensTokenAccountData.accountAddress,
			fortunaSharesToMint,
			fortunaTokensTokenAccountData.tokenAccountIdDb,
			parseInt(FORTUNA_TOKENS_WALLET_ID_DB, 10)
		)

		await addSplOwnership(
			splId,
			creatorShares,
			creatorSolanaWalletId,
			0
		)

		EscrowWalletManager.getInstance().addSplToMap(splTokenPublicKey, escrowSharesToMint)
	} catch (error) {
		console.error(error)
		throw error
	}
}
