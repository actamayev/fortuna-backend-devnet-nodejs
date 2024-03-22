import _ from "lodash"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
import mintSPLHelper from "./mint-spl-helper"
import { findSolanaWalletByPublicKey } from "../find/find-solana-wallet"
import addTokenAccountRecord from "../db-operations/add-token-account-record"
import get51SolanaWalletFromSecretKey from "./get-51-solana-wallet-from-secret-key"

// eslint-disable-next-line max-lines-per-function, max-params, complexity
export default async function assignSPLTokenShares (
	splTokenPublicKey: PublicKey,
	creatorPublicKey: PublicKey,
	uploadSplData: NewSPLData,
	splId: number,
	creatorWalletId: number
): Promise<"success" | void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"))
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()

		// Get or Create Token Accounts:
		const fiftyoneTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			fiftyoneWallet.publicKey
		)

		const fiftyoneWalletDB = await findSolanaWalletByPublicKey(fiftyoneWallet.publicKey, "DEVNET")
		if (_.isNull(fiftyoneWalletDB) || fiftyoneWalletDB === undefined) return
		const fiftyoneTokenAccountDB = await addTokenAccountRecord(splId, fiftyoneWalletDB.solana_wallet_id)
		if (_.isNull(fiftyoneTokenAccountDB) || fiftyoneTokenAccountDB === undefined) return

		const creatorTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			creatorPublicKey
		)
		const creatorTokenAccountDB = await addTokenAccountRecord(splId, creatorWalletId)
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
		const fiftyoneEscrowTokenAccountDB = await addTokenAccountRecord(splId, fiftyoneEscrowWalletDB.solana_wallet_id)
		if (_.isNull(fiftyoneEscrowTokenAccountDB) || fiftyoneEscrowTokenAccountDB === undefined) return

		await mintSPLHelper(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			splId,
			fiftyoneWallet.publicKey,
			fiftyoneTokenAccount.address,
			uploadSplData.numberOfShares * (1 / 100),
			fiftyoneTokenAccountDB.token_account_id,
			fiftyoneWalletDB.solana_wallet_id
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
			creatorWalletId
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
			fiftyoneEscrowWalletDB.solana_wallet_id
		)

		return "success"
	} catch (error) {
		console.error(error)
	}
}
