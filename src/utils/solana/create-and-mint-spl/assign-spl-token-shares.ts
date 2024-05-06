import _ from "lodash"
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import mintSPLHelper from "./mint-spl-helper"
import { getWalletBalanceWithUSD } from "../get-wallet-balance"
import EscrowWalletManager from "../../../classes/escrow-wallet-manager"
import { getFortunaSolanaWalletFromSecretKey } from "../get-fortuna-solana-wallet-from-secret-key"
import addTokenAccountRecord from "../../db-operations/write/token-account/add-token-account-record"
import SecretsManager from "../../../classes/secrets-manager"

// eslint-disable-next-line max-lines-per-function
export default async function assignSPLTokenShares (
	splTokenPublicKey: PublicKey,
	creatorPublicKey: PublicKey,
	uploadSplData: IncomingNewSPLData,
	splId: number,
	creatorWalletId: number
): Promise<void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fortunaWallet = await getFortunaSolanaWalletFromSecretKey()
		const fortunaWalletPublicKey = await SecretsManager.getInstance().getSecret("FORTUNA_WALLET_PUBLIC_KEY")

		const initialWalletBalance = await getWalletBalanceWithUSD(fortunaWalletPublicKey)
		// Get or Create Token Accounts:
		const fortunaTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			fortunaWallet.publicKey
		)

		const secondWalletBalance = await getWalletBalanceWithUSD(fortunaWalletPublicKey)

		const solanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_SOLANA_WALLET_ID_DB")

		// FUTURE TODO: Combine the addtokenAccountRecord with the mint spl helper (addsplmintwithownership)
		const fortunaTokenAccountDB = await addTokenAccountRecord(
			splId,
			parseInt(solanaWalletIdDb, 10),
			fortunaTokenAccount.address,
			initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol,
			initialWalletBalance.balanceInUsd - secondWalletBalance.balanceInUsd
		)

		const creatorTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			creatorPublicKey
		)
		const thirdWalletBalance = await getWalletBalanceWithUSD(fortunaWalletPublicKey)

		const creatorTokenAccountDB = await addTokenAccountRecord(
			splId,
			creatorWalletId,
			creatorTokenAccount.address,
			secondWalletBalance.balanceInSol - thirdWalletBalance.balanceInSol,
			secondWalletBalance.balanceInUsd - thirdWalletBalance.balanceInUsd
		)

		const fortunaEscrowWalletPublicKey = await SecretsManager.getInstance().getSecret("FORTUNA_ESCROW_WALLET_PUBLIC_KEY")

		const fortunaEscrowPublicKey = new PublicKey(fortunaEscrowWalletPublicKey)
		const fortunaEscrowTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			fortunaEscrowPublicKey
		)
		const fourthWalletBalance = await getWalletBalanceWithUSD(fortunaWalletPublicKey)

		const fortunaEscrowSolanaWalletIdDb = await SecretsManager.getInstance().getSecret("FORTUNA_ESCROW_SOLANA_WALLET_ID_DB")

		const fortunaEscrowTokenAccountDB = await addTokenAccountRecord(
			splId,
			parseInt(fortunaEscrowSolanaWalletIdDb, 10),
			fortunaEscrowTokenAccount.address,
			thirdWalletBalance.balanceInSol - fourthWalletBalance.balanceInSol,
			thirdWalletBalance.balanceInUsd - fourthWalletBalance.balanceInUsd
		)

		const fortunaShares = _.ceil(uploadSplData.numberOfShares * (0.01))

		// Mint SPLs:
		await mintSPLHelper(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			splId,
			fortunaWallet.publicKey,
			fortunaTokenAccount.address,
			fortunaShares,
			fortunaTokenAccountDB.token_account_id
		)

		const creatorShares = _.floor(uploadSplData.creatorOwnershipPercentage * uploadSplData.numberOfShares * 0.01)

		await mintSPLHelper(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			splId,
			fortunaWallet.publicKey,
			creatorTokenAccount.address,
			creatorShares,
			creatorTokenAccountDB.token_account_id
		)

		const escrowShares = uploadSplData.numberOfShares - creatorShares - fortunaShares

		await mintSPLHelper(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			splId,
			fortunaWallet.publicKey,
			fortunaEscrowTokenAccount.address,
			escrowShares,
			fortunaEscrowTokenAccountDB.token_account_id
		)

		EscrowWalletManager.getInstance().addSplToMap(splTokenPublicKey.toString(), escrowShares)
	} catch (error) {
		console.error(error)
		throw error
	}
}
