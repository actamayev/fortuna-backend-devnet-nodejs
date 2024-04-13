import _ from "lodash"
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import mintSPLHelper from "./mint-spl-helper"
import getWalletBalance from "./get-wallet-balance"
import { findSolanaWalletByPublicKey } from "../db-operations/read/find/find-solana-wallet"
import getFortunaSolanaWalletFromSecretKey from "./get-fortuna-solana-wallet-from-secret-key"
import addTokenAccountRecord from "../db-operations/write/token-account/add-token-account-record"

// eslint-disable-next-line max-params, max-lines-per-function, complexity
export default async function assignSPLTokenShares (
	splTokenPublicKey: PublicKey,
	creatorPublicKey: PublicKey,
	uploadSplData: IncomingNewSPLData,
	splId: number,
	creatorWalletId: number,
	fortunaWalletId: number,
): Promise<"success" | void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fortunaWallet = getFortunaSolanaWalletFromSecretKey()

		const initialWalletBalance = await getWalletBalance("devnet", process.env.FORTUNA_WALLET_PUBLIC_KEY)
		// Get or Create Token Accounts:
		const fortunaTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			fortunaWallet.publicKey
		)

		const secondWalletBalance = await getWalletBalance("devnet", process.env.FORTUNA_WALLET_PUBLIC_KEY)
		if (initialWalletBalance === undefined || secondWalletBalance === undefined) return

		const fortunaTokenAccountId = await addTokenAccountRecord(
			splId,
			fortunaWalletId,
			fortunaTokenAccount.address,
			initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol,
			initialWalletBalance.balanceInUsd - secondWalletBalance.balanceInUsd,
			fortunaWalletId
		)
		if (_.isNull(fortunaTokenAccountId) || fortunaTokenAccountId === undefined) return

		const creatorTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			creatorPublicKey
		)
		const thirdWalletBalance = await getWalletBalance("devnet", process.env.FORTUNA_WALLET_PUBLIC_KEY)

		if (thirdWalletBalance === undefined) return
		const creatorTokenAccountId = await addTokenAccountRecord(
			splId,
			creatorWalletId,
			creatorTokenAccount.address,
			secondWalletBalance.balanceInSol - thirdWalletBalance.balanceInSol,
			secondWalletBalance.balanceInUsd - thirdWalletBalance.balanceInUsd,
			fortunaWalletId
		)
		if (_.isNull(creatorTokenAccountId) || creatorTokenAccountId === undefined) return

		const fortunaEscrowPublicKey = new PublicKey(process.env.FORTUNA_ESCROW_WALLET_PUBLIC_KEY)
		const fortunaEscrowTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			fortunaEscrowPublicKey
		)
		const fourthWalletBalance = await getWalletBalance("devnet", process.env.FORTUNA_WALLET_PUBLIC_KEY)
		if (fourthWalletBalance === undefined) return
		const fortunaEscrowWalletDB = await findSolanaWalletByPublicKey(process.env.FORTUNA_ESCROW_WALLET_PUBLIC_KEY, "devnet")
		if (fortunaEscrowWalletDB === undefined || _.isNull(fortunaEscrowWalletDB)) return
		const fortunaEscrowTokenAccountId = await addTokenAccountRecord(
			splId,
			fortunaEscrowWalletDB.solana_wallet_id,
			fortunaEscrowTokenAccount.address,
			thirdWalletBalance.balanceInSol - fourthWalletBalance.balanceInSol,
			thirdWalletBalance.balanceInUsd - fourthWalletBalance.balanceInUsd,
			fortunaWalletId
		)
		if (_.isNull(fortunaEscrowTokenAccountId) || fortunaEscrowTokenAccountId === undefined) return

		// Mint SPLs:
		await mintSPLHelper(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			splId,
			fortunaWallet.publicKey,
			fortunaTokenAccount.address,
			uploadSplData.numberOfShares * (1 / 100),
			fortunaTokenAccountId,
			fortunaWalletId,
		)

		await mintSPLHelper(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			splId,
			fortunaWallet.publicKey,
			creatorTokenAccount.address,
			uploadSplData.numberOfShares * (uploadSplData.creatorOwnershipPercentage / 100),
			creatorTokenAccountId,
			fortunaWalletId,
		)

		await mintSPLHelper(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			splId,
			fortunaWallet.publicKey,
			fortunaEscrowTokenAccount.address,
			uploadSplData.numberOfShares * ((99 - uploadSplData.creatorOwnershipPercentage) / 100),
			fortunaEscrowTokenAccountId,
			fortunaWalletId,
		)

		// FUTURE TODO: See if there's a way to prevent more shares from being minted after assigning the shares.
		// FUTURE TODO: Also, then transfer the ownership of the SPL to the creator

		return "success"
	} catch (error) {
		console.error(error)
	}
}
