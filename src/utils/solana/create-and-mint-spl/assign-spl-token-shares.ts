import _ from "lodash"
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import mintSPLHelper from "./mint-spl-helper"
import SecretsManager from "../../../classes/secrets-manager"
import { getWalletBalanceWithUSD } from "../get-wallet-balance"
import GetKeypairFromSecretKey from "../get-keypair-from-secret-key"
import EscrowWalletManager from "../../../classes/escrow-wallet-manager"
import addTokenAccountRecord from "../../../db-operations/write/token-account/add-token-account-record"
import addSplOwnership from "../../../db-operations/write/spl-ownership/add-spl-ownership"

// eslint-disable-next-line max-lines-per-function
export default async function assignSPLTokenShares (
	splTokenPublicKey: PublicKey,
	uploadSplData: IncomingNewSPLData,
	splId: number,
	creatorSolanaWalletId: number
): Promise<void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fortunaFeePayerWallet = await GetKeypairFromSecretKey.getFortunaFeePayerWalletKeypair()
		const {
			FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_PUBLIC_KEY,
			FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB,
			FORTUNA_TOKENS_WALLET_PUBLIC_KEY,
			FORTUNA_TOKENS_WALLET_ID_DB
		} = await SecretsManager.getInstance().getSecrets([
			"FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_PUBLIC_KEY", "FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB",
			"FORTUNA_TOKENS_WALLET_PUBLIC_KEY", "FORTUNA_TOKENS_WALLET_ID_DB"
		])

		// Token Account Creation for Escrow Account:
		const initialWalletBalance = await getWalletBalanceWithUSD(fortunaFeePayerWallet.publicKey)
		const fortunaEscrowTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fortunaFeePayerWallet,
			splTokenPublicKey,
			new PublicKey(FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_PUBLIC_KEY)
		)

		const secondWalletBalance = await getWalletBalanceWithUSD(fortunaFeePayerWallet.publicKey)

		// ASAP TODO: Combine the addtokenAccountRecord with the mint spl helper (addsplmintwithownership)
		const fortunaTokenAccountDB = await addTokenAccountRecord(
			splId,
			parseInt(FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB, 10),
			fortunaEscrowTokenAccount.address,
			initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol,
			initialWalletBalance.balanceInUsd - secondWalletBalance.balanceInUsd
		)

		// Token Account Creation for Fortuna Tokens Account:
		const fortunaTokensTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fortunaFeePayerWallet,
			splTokenPublicKey,
			new PublicKey(FORTUNA_TOKENS_WALLET_PUBLIC_KEY)
		)
		const thirdWalletBalance = await getWalletBalanceWithUSD(fortunaFeePayerWallet.publicKey)

		const fortunaTokensTokenAccountDB = await addTokenAccountRecord(
			splId,
			parseInt(FORTUNA_TOKENS_WALLET_ID_DB, 10),
			fortunaTokensTokenAccount.address,
			secondWalletBalance.balanceInSol - thirdWalletBalance.balanceInSol,
			secondWalletBalance.balanceInUsd - thirdWalletBalance.balanceInUsd
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
			fortunaEscrowTokenAccount.address,
			escrowSharesToMint,
			fortunaTokenAccountDB.token_account_id,
			parseInt(FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB, 10)
		)

		await mintSPLHelper(
			fortunaFeePayerWallet,
			splTokenPublicKey,
			splId,
			fortunaFeePayerWallet.publicKey,
			fortunaTokensTokenAccount.address,
			fortunaSharesToMint,
			fortunaTokensTokenAccountDB.token_account_id,
			parseInt(FORTUNA_TOKENS_WALLET_ID_DB, 10)
		)

		await addSplOwnership(
			splId,
			creatorShares,
			creatorSolanaWalletId
		)

		EscrowWalletManager.getInstance().addSplToMap(splTokenPublicKey.toString(), escrowSharesToMint)
	} catch (error) {
		console.error(error)
		throw error
	}
}
