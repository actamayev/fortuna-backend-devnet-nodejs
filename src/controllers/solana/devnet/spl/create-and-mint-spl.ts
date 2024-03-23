import _ from "lodash"
import { Request, Response } from "express"
import { PublicKey } from "@solana/web3.js"
import { createS3Key } from "../../../../utils/s3/create-s3-key"
import createSPLToken from "../../../../utils/solana/create-spl-token"
import AwsStorageService from "../../../../classes/aws-storage-service"
import addSPLRecord from "../../../../utils/db-operations/spl/add-spl-record"
import assignSPLTokenShares from "../../../../utils/solana/assign-spl-token-shares"
import { findSolanaWalletByPublicKey } from "../../../../utils/find/find-solana-wallet"
import get51SolanaWalletFromSecretKey from "../../../../utils/solana/get-51-solana-wallet-from-secret-key"
import printWalletBalance from "../../../../utils/solana/print-wallet-balance"

// eslint-disable-next-line complexity, max-lines-per-function
export default async function createAndMintSPL (req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet
		const newSPLData = req.body.newSPLData as NewSPLData
		await printWalletBalance("At the Beginning")

		const uploadJSONS3Key = createS3Key("spl-metadata", newSPLData.fileName, newSPLData.uuid)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { uuid, uploadedImageId, ...restOfNewSPLData } = newSPLData
		const metadataJSONUrl = await AwsStorageService.getInstance().uploadJSON(restOfNewSPLData, uploadJSONS3Key)
		if (metadataJSONUrl === undefined) return res.status(400).json({ message: "Unable to upload JSON" })

		const splTokenPublicKey = await createSPLToken(metadataJSONUrl, newSPLData.splName)
		if (splTokenPublicKey === undefined) return res.status(400).json({ message: "Unable to create NFT" })

		const fiftyoneWallet = get51SolanaWalletFromSecretKey()
		const fiftyoneWalletDB = await findSolanaWalletByPublicKey(fiftyoneWallet.publicKey, "DEVNET")
		if (_.isNull(fiftyoneWalletDB) || fiftyoneWalletDB === undefined) {
			return res.status(400).json({ message: "Unable to find 51Crypto's Solana Wallet" })
		}

		const addSPLResponse = await addSPLRecord(
			metadataJSONUrl,
			newSPLData,
			splTokenPublicKey,
			solanaWallet.solana_wallet_id,
			fiftyoneWalletDB.solana_wallet_id
		)
		if (addSPLResponse === undefined) return res.status(400).json({ message: "Unable to save SPL to DB" })

		await AwsStorageService.getInstance().updateJSONInS3(uploadJSONS3Key, { splTokenPublicKey: splTokenPublicKey.toString()})

		const creatorPublicKey = new PublicKey(solanaWallet.public_key)
		const assignSPLTokenSharesResponse = await assignSPLTokenShares(
			splTokenPublicKey,
			creatorPublicKey,
			newSPLData,
			addSPLResponse.spl_id,
			solanaWallet.solana_wallet_id,
			fiftyoneWalletDB.solana_wallet_id
		)
		await printWalletBalance("After Assigning SPL Token Shares")

		if (!_.isEqual(assignSPLTokenSharesResponse, "success")) {
			return res.status(400).json({ message: "Unable to assign SPL Shares" })
		}

		return res.status(200).json({ splTokenPublicKey })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create and Mint NFT" })
	}
}
