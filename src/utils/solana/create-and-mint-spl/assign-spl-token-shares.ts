import _ from "lodash"
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import mintSPLHelper from "./mint-spl-helper"
import { getWalletBalanceWithUSD } from "../get-wallet-balance"
import { getFortunaSolanaWalletFromSecretKey } from "../get-fortuna-solana-wallet-from-secret-key"
import addTokenAccountRecord from "../../db-operations/write/token-account/add-token-account-record"

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
		const fortunaWallet = getFortunaSolanaWalletFromSecretKey()

		const initialWalletBalance = await getWalletBalanceWithUSD(process.env.FORTUNA_WALLET_PUBLIC_KEY)
		// Get or Create Token Accounts:
		const fortunaTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			fortunaWallet.publicKey
		)

		const secondWalletBalance = await getWalletBalanceWithUSD(process.env.FORTUNA_WALLET_PUBLIC_KEY)

		// FUTURE TODO: Combine the addtokenAccountRecord with the mint spl helper (addsplmintwithownership)
		const fortunaTokenAccountDB = await addTokenAccountRecord(
			splId,
			Number(process.env.FORTUNA_SOLANA_WALLET_ID_DB),
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
		const thirdWalletBalance = await getWalletBalanceWithUSD(process.env.FORTUNA_WALLET_PUBLIC_KEY)

		const creatorTokenAccountDB = await addTokenAccountRecord(
			splId,
			creatorWalletId,
			creatorTokenAccount.address,
			secondWalletBalance.balanceInSol - thirdWalletBalance.balanceInSol,
			secondWalletBalance.balanceInUsd - thirdWalletBalance.balanceInUsd
		)

		const fortunaEscrowPublicKey = new PublicKey(process.env.FORTUNA_ESCROW_WALLET_PUBLIC_KEY)
		const fortunaEscrowTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			fortunaEscrowPublicKey
		)
		const fourthWalletBalance = await getWalletBalanceWithUSD(process.env.FORTUNA_WALLET_PUBLIC_KEY)

		const fortunaEscrowTokenAccountDB = await addTokenAccountRecord(
			splId,
			Number(process.env.FORTUNA_ESCROW_SOLANA_WALLET_ID_DB),
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
	} catch (error) {
		console.error(error)
		throw error
	}
}
