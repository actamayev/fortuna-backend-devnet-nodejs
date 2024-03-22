import _ from "lodash"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token"
import { findSolanaWalletByPublicKey } from "../find/find-solana-wallet"
import addTokenAccountRecord from "../db-operations/add-token-account-record"
import get51SolanaWalletFromSecretKey from "./get-51-solana-wallet-from-secret-key"
import addSPLMintRecord from "../db-operations/spl/add-spl-mint-record"

// eslint-disable-next-line max-lines-per-function, max-params, complexity
export default async function assignSPLTokenShares (
	splTokenPublicKey: PublicKey,
	creatorPublicKey: PublicKey,
	uploadSplData: NewSPLData,
	splId: number,
	creatorWalletId: number
): Promise<{
	fiftyoneTokenAccountId: number,
	creatorTokenAccountId: number,
	fiftyoneEscrowTokenAccountId: number
} | void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"))
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()

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

		const mintToFiftyoneWalletTransactionSignature = await mintTo(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			fiftyoneTokenAccount.address,
			fiftyoneWallet.publicKey,
			uploadSplData.numberOfShares * (1 / 100)
			// TODO: Figure out what happens if the share count is non-divisiable by 100
			// If the share count is 140, then 51's ownership is 1.4, which won't work b/c the decimal is 0 (shares are indivisible)
		)

		await addSPLMintRecord(
			splId,
			fiftyoneTokenAccountDB.token_account_id,
			uploadSplData.numberOfShares * (1 / 100),
			0, // TODO: Fix this to account for the blockchain mint fee
			fiftyoneWalletDB.solana_wallet_id,
			mintToFiftyoneWalletTransactionSignature
		)

		const mintToCreatorTransactionSignature = await mintTo(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			creatorTokenAccount.address,
			fiftyoneWallet.publicKey,
			uploadSplData.numberOfShares * (uploadSplData.creatorOwnershipPercentage / 100)
		)

		await addSPLMintRecord(
			splId,
			creatorTokenAccountDB.token_account_id,
			uploadSplData.numberOfShares * (uploadSplData.creatorOwnershipPercentage / 100),
			0,
			fiftyoneWalletDB.solana_wallet_id,
			mintToCreatorTransactionSignature
		)

		const mintToEscrowTransactionSignature = await mintTo(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			fiftyoneEscrowTokenAccount.address,
			fiftyoneWallet.publicKey,
			uploadSplData.numberOfShares * ((99 - uploadSplData.creatorOwnershipPercentage) / 100)
		)

		await addSPLMintRecord(
			splId,
			fiftyoneEscrowTokenAccountDB.token_account_id,
			uploadSplData.numberOfShares * ((99 - uploadSplData.creatorOwnershipPercentage) / 100),
			0,
			fiftyoneWalletDB.solana_wallet_id,
			mintToEscrowTransactionSignature
		)

		return {
			fiftyoneTokenAccountId: fiftyoneTokenAccountDB.token_account_id,
			creatorTokenAccountId: creatorTokenAccountDB.token_account_id,
			fiftyoneEscrowTokenAccountId: fiftyoneEscrowTokenAccountDB.token_account_id
		}
	} catch (error) {
		console.error(error)
	}
}
