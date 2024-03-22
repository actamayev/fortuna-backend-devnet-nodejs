import _ from "lodash"
import { Request, Response } from "express"
import { PublicKey } from "@solana/web3.js"
import { createS3Key } from "../../../../utils/s3/create-s3-key"
import createSPLToken from "../../../../utils/solana/create-spl-token"
import AwsStorageService from "../../../../classes/aws-storage-service"
import { findSolanaWalletByUserId } from "../../../../utils/find/find-solana-wallet"
import addSPLRecord from "../../../../utils/db-operations/spl/add-spl-record"
import assignSPLTokenShares from "../../../../utils/solana/assign-spl-token-shares"

export default async function createAndMintSPL (req: Request, res: Response): Promise<Response> {
	try {
		const creator = req.user
		const newSPLData = req.body.newSPLData as NewSPLData

		const uploadJSONS3Key = createS3Key("spl-metadata", newSPLData.fileName, newSPLData.uuid)
		const metadataJSONUrl = await AwsStorageService.getInstance().uploadJSON(newSPLData, uploadJSONS3Key)
		if (metadataJSONUrl === undefined) return res.status(400).json({ message: "Unable to upload JSON" })

		const creatorWallet = await findSolanaWalletByUserId(creator.user_id, "DEVNET")
		if (_.isNull(creatorWallet) || creatorWallet === undefined) {
			return res.status(400).json({ message: "Unable to find Devnet Solana Wallet" })
		}

		const splTokenPublicKey = await createSPLToken(metadataJSONUrl, newSPLData)
		if (splTokenPublicKey === undefined) return res.status(400).json({ message: "Unable to create NFT" })

		const addSPLResponse = await addSPLRecord(metadataJSONUrl, newSPLData, splTokenPublicKey, creatorWallet.solana_wallet_id)
		if (addSPLResponse === undefined) return res.status(400).json({ message: "Unable to save SPL to DB" })

		await AwsStorageService.getInstance().updateJSONInS3(uploadJSONS3Key, splTokenPublicKey.toString())

		const assignSPLTokenSharesResponse = await assignSPLTokenShares(
			splTokenPublicKey,
			creatorWallet.public_key as unknown as PublicKey,
			newSPLData,
			addSPLResponse.spl_id,
			creatorWallet.solana_wallet_id
		)

		if (!_.isEqual(assignSPLTokenSharesResponse, "success")) {
			return res.status(400).json({ message: "Unable to assign SPL Shares" })
		}

		return res.status(200).json({ splTokenPublicKey })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create and Mint NFT" })
	}
}
