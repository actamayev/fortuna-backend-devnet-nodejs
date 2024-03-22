import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import { Account, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token"
import get51SolanaWalletFromSecretKey from "./get-51-solana-wallet-from-secret-key"
import addTokenAccountRecord from "../db-operations/add-token-account-record"

// eslint-disable-next-line max-lines-per-function
export default async function assignSPLTokenShares (
	splTokenPublicKey: PublicKey,
	creatorPublicKey: PublicKey,
	nftData: UploadNFT,
	splId: number
): Promise<{
	fiftyoneTokenAccount: Account,
	creatorTokenAccount: Account,
	fiftyoneEscrowTokenAccount: Account
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

		await addTokenAccountRecord(splId, fiftyoneWalletId)

		const creatorTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			creatorPublicKey
		)

		await addTokenAccountRecord(splId, creatorWalletId)

		const fiftyoneCryptoEscrowSecretKey = new PublicKey(process.env.FIFTYONE_CRYPTO_ESCROW_WALLET_PUBLIC_KEY)

		const fiftyoneEscrowTokenAccount = await getOrCreateAssociatedTokenAccount(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			fiftyoneCryptoEscrowSecretKey
		)

		await addTokenAccountRecord(splId, fiftyoneEscrowWalletId)

		const mintToFiftyoneWalletTransactionSignature = await mintTo(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			fiftyoneTokenAccount.address,
			fiftyoneWallet.publicKey,
			nftData.numberOfShares * (10 ** 9)
		)

		const mintToCreatorTransactionSignature = await mintTo(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			creatorTokenAccount.address,
			fiftyoneWallet.publicKey,
			nftData.numberOfShares * (10 ** 9) * (nftData.creatorOwnershipPercentage / 100)
		)

		const mintToEscrowTransactionSignature = await mintTo(
			connection,
			fiftyoneWallet,
			splTokenPublicKey,
			fiftyoneEscrowTokenAccount.address,
			fiftyoneWallet.publicKey,
			nftData.numberOfShares * (10 ** 9) * ((99 - nftData.creatorOwnershipPercentage) / 100)
		)

		return {
			fiftyoneTokenAccount,
			creatorTokenAccount,
			fiftyoneEscrowTokenAccount
		}
	} catch (error) {
		console.error(error)
	}
}
