import _ from "lodash"
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import mintSPLHelper from "./mint-spl-helper"
import getWalletBalance from "./get-wallet-balance"
import { findSolanaWalletByPublicKey } from "../find/find-solana-wallet"
import addTokenAccountRecord from "../db-operations/add-token-account-record"
import get51SolanaWalletFromSecretKey from "./get-51-solana-wallet-from-secret-key"

// eslint-disable-next-line max-params, max-lines-per-function, complexity
export default async function assignSPLTokenShares (
	splTokenPublicKey: PublicKey,
	creatorPublicKey: PublicKey,
	uploadSplData: NewSPLData,
	splId: number,
	creatorWalletId: number,
	fiftyoneCryptoWalletId: number,
	solPriceInUSD: number
): Promise<"success" | void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()

		const initialWalletBalance = await getWalletBalance("devnet", process.env.FIFTYONE_CRYPTO_WALLET_PUBLIC_KEY, solPriceInUSD)
		// Get or Create Token Accounts:
		const fiftyoneTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			fiftyoneWallet.publicKey
		)

		const secondWalletBalance = await getWalletBalance("devnet", process.env.FIFTYONE_CRYPTO_WALLET_PUBLIC_KEY, solPriceInUSD)
		if (initialWalletBalance === undefined || secondWalletBalance === undefined) return

		const fiftyoneTokenAccountId = await addTokenAccountRecord(
			splId,
			fiftyoneCryptoWalletId,
			fiftyoneTokenAccount.address,
			initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol,
			initialWalletBalance.balanceInUsd - secondWalletBalance.balanceInUsd,
			fiftyoneCryptoWalletId
		)
		if (_.isNull(fiftyoneTokenAccountId) || fiftyoneTokenAccountId === undefined) return

		const creatorTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			creatorPublicKey
		)
		const thirdWalletBalance = await getWalletBalance("devnet", process.env.FIFTYONE_CRYPTO_WALLET_PUBLIC_KEY, solPriceInUSD)

		if (thirdWalletBalance === undefined) return
		const creatorTokenAccountId = await addTokenAccountRecord(
			splId,
			creatorWalletId,
			creatorTokenAccount.address,
			secondWalletBalance.balanceInSol - thirdWalletBalance.balanceInSol,
			secondWalletBalance.balanceInUsd - thirdWalletBalance.balanceInUsd,
			fiftyoneCryptoWalletId
		)
		if (_.isNull(creatorTokenAccountId) || creatorTokenAccountId === undefined) return

		const fiftyoneCryptoEscrowPublicKey = new PublicKey(process.env.FIFTYONE_CRYPTO_ESCROW_WALLET_PUBLIC_KEY)
		const fiftyoneEscrowTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			fiftyoneCryptoEscrowPublicKey
		)
		const fourthWalletBalance = await getWalletBalance("devnet", process.env.FIFTYONE_CRYPTO_WALLET_PUBLIC_KEY, solPriceInUSD)
		if (fourthWalletBalance === undefined) return
		const fiftyoneEscrowWalletDB = await findSolanaWalletByPublicKey(process.env.FIFTYONE_CRYPTO_ESCROW_WALLET_PUBLIC_KEY, "devnet")
		if (fiftyoneEscrowWalletDB === undefined || _.isNull(fiftyoneEscrowWalletDB)) return
		const fiftyoneEscrowTokenAccountId = await addTokenAccountRecord(
			splId,
			fiftyoneEscrowWalletDB.solana_wallet_id,
			fiftyoneEscrowTokenAccount.address,
			thirdWalletBalance.balanceInSol - fourthWalletBalance.balanceInSol,
			thirdWalletBalance.balanceInUsd - fourthWalletBalance.balanceInUsd,
			fiftyoneCryptoWalletId
		)
		if (_.isNull(fiftyoneEscrowTokenAccountId) || fiftyoneEscrowTokenAccountId === undefined) return

		// Mint SPLs:
		await mintSPLHelper(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			splId,
			fiftyoneWallet.publicKey,
			fiftyoneTokenAccount.address,
			uploadSplData.numberOfShares * (1 / 100),
			fiftyoneTokenAccountId,
			fiftyoneCryptoWalletId,
			solPriceInUSD
		)

		await mintSPLHelper(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			splId,
			fiftyoneWallet.publicKey,
			creatorTokenAccount.address,
			uploadSplData.numberOfShares * (uploadSplData.creatorOwnershipPercentage / 100),
			creatorTokenAccountId,
			fiftyoneCryptoWalletId,
			solPriceInUSD
		)

		await mintSPLHelper(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			splId,
			fiftyoneWallet.publicKey,
			fiftyoneEscrowTokenAccount.address,
			uploadSplData.numberOfShares * ((99 - uploadSplData.creatorOwnershipPercentage) / 100),
			fiftyoneEscrowTokenAccountId,
			fiftyoneCryptoWalletId,
			solPriceInUSD
		)

		// FUTURE TODO: See if there's a way to prevent more shares from being minted after assigning the shares.
		// FUTURE TODO: Also, then transfer the ownership of the SPL to the creator

		return "success"
	} catch (error) {
		console.error(error)
	}
}
