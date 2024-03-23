import _ from "lodash"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
import mintSPLHelper from "./mint-spl-helper"
import { findSolanaWalletByPublicKey } from "../find/find-solana-wallet"
import addTokenAccountRecord from "../db-operations/add-token-account-record"
import get51SolanaWalletFromSecretKey from "./get-51-solana-wallet-from-secret-key"
import getSolPriceInUSD from "./get-sol-price-in-usd"

// eslint-disable-next-line max-lines-per-function, max-params, complexity
export default async function assignSPLTokenShares (
	splTokenPublicKey: PublicKey,
	creatorPublicKey: PublicKey,
	uploadSplData: NewSPLData,
	splId: number,
	creatorWalletId: number,
	fiftyoneCryptoWalletId: number
): Promise<"success" | void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()

		// Get or Create Token Accounts:
		const fiftyoneTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			fiftyoneWallet.publicKey
		)

		const fiftyoneTokenAccountDB = await addTokenAccountRecord(splId, fiftyoneCryptoWalletId, fiftyoneTokenAccount.address)
		if (_.isNull(fiftyoneTokenAccountDB) || fiftyoneTokenAccountDB === undefined) return

		const creatorTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			creatorPublicKey
		)
		const creatorTokenAccountDB = await addTokenAccountRecord(splId, creatorWalletId, creatorTokenAccount.address)
		if (_.isNull(creatorTokenAccountDB) || creatorTokenAccountDB === undefined) return

		const fiftyoneCryptoEscrowPublicKey = new PublicKey(process.env.FIFTYONE_CRYPTO_ESCROW_WALLET_PUBLIC_KEY)
		const fiftyoneEscrowTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			fiftyoneCryptoEscrowPublicKey
		)
		const fiftyoneEscrowWalletDB = await findSolanaWalletByPublicKey(fiftyoneCryptoEscrowPublicKey, "DEVNET")
		if (fiftyoneEscrowWalletDB === undefined || _.isNull(fiftyoneEscrowWalletDB)) return
		const fiftyoneEscrowTokenAccountDB = await addTokenAccountRecord(
			splId,
			fiftyoneEscrowWalletDB.solana_wallet_id,
			fiftyoneEscrowTokenAccount.address
		)
		if (_.isNull(fiftyoneEscrowTokenAccountDB) || fiftyoneEscrowTokenAccountDB === undefined) return

		const solPriceInUSD = await getSolPriceInUSD()

		if (_.isNull(solPriceInUSD)) return

		await mintSPLHelper(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			splId,
			fiftyoneWallet.publicKey,
			fiftyoneTokenAccount.address,
			uploadSplData.numberOfShares * (1 / 100),
			fiftyoneTokenAccountDB.token_account_id,
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
			creatorTokenAccountDB.token_account_id,
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
			fiftyoneEscrowTokenAccountDB.token_account_id,
			fiftyoneCryptoWalletId,
			solPriceInUSD
		)

		return "success"
	} catch (error) {
		console.error(error)
	}
}
