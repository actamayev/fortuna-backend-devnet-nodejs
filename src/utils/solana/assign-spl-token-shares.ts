import _ from "lodash"
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import mintSPLHelper from "./mint-spl-helper"
import getWalletBalance from "./get-wallet-balance"
import { findSolanaWalletByPublicKey } from "../db-operations/read/find/find-solana-wallet"
import getFortunaSolanaWalletFromSecretKey from "./get-fortuna-solana-wallet-from-secret-key"
import addTokenAccountRecord from "../db-operations/write/token-account/add-token-account-record"

// eslint-disable-next-line max-lines-per-function
export default async function assignSPLTokenShares (
	splTokenPublicKey: PublicKey,
	creatorPublicKey: PublicKey,
	uploadSplData: IncomingNewSPLData,
	splId: number,
	creatorWalletId: number,
	fortunaWalletId: number,
): Promise<void> {
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

		const fortunaTokenAccountId = await addTokenAccountRecord(
			splId,
			fortunaWalletId,
			fortunaTokenAccount.address,
			initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol,
			initialWalletBalance.balanceInUsd - secondWalletBalance.balanceInUsd,
			fortunaWalletId
		)

		const creatorTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			creatorPublicKey
		)
		const thirdWalletBalance = await getWalletBalance("devnet", process.env.FORTUNA_WALLET_PUBLIC_KEY)

		const creatorTokenAccountId = await addTokenAccountRecord(
			splId,
			creatorWalletId,
			creatorTokenAccount.address,
			secondWalletBalance.balanceInSol - thirdWalletBalance.balanceInSol,
			secondWalletBalance.balanceInUsd - thirdWalletBalance.balanceInUsd,
			fortunaWalletId
		)

		const fortunaEscrowPublicKey = new PublicKey(process.env.FORTUNA_ESCROW_WALLET_PUBLIC_KEY)
		const fortunaEscrowTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fortunaWallet,
			splTokenPublicKey,
			fortunaEscrowPublicKey
		)
		const fourthWalletBalance = await getWalletBalance("devnet", process.env.FORTUNA_WALLET_PUBLIC_KEY)
		const fortunaEscrowWalletDB = await findSolanaWalletByPublicKey(process.env.FORTUNA_ESCROW_WALLET_PUBLIC_KEY, "devnet")
		if (_.isNull(fortunaEscrowWalletDB)) throw Error("Cannot find Fortuna's Escrow Wallet")

		const fortunaEscrowTokenAccountId = await addTokenAccountRecord(
			splId,
			fortunaEscrowWalletDB.solana_wallet_id,
			fortunaEscrowTokenAccount.address,
			thirdWalletBalance.balanceInSol - fourthWalletBalance.balanceInSol,
			thirdWalletBalance.balanceInUsd - fourthWalletBalance.balanceInUsd,
			fortunaWalletId
		)

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
	} catch (error) {
		console.error(error)
		throw error
	}
}
