import _ from "lodash"
import { Request, Response } from "express"
import { PublicKey } from "@solana/web3.js"
import { createS3Key } from "../../../../utils/s3/create-s3-key"
import createSPLToken from "../../../../utils/solana/create-spl-token"
import AwsStorageService from "../../../../classes/aws-storage-service"
import findSolanaWallet from "../../../../utils/find/find-solana-wallet"
import addSPLRecord from "../../../../utils/db-operations/spl/add-spl-record"
import assignSPLTokenShares from "../../../../utils/solana/assign-spl-token-shares"
import addSPLOwnershipRecord from "../../../../utils/db-operations/spl/add-spl-ownership-record"

// eslint-disable-next-line complexity, max-lines-per-function
export default async function createAndMintSPL (req: Request, res: Response): Promise<Response> {
	try {
		const creator = req.user
		const uploadSPLData = req.body.newSPLData as NewSPLData

		const uploadJSONS3Key = createS3Key("spl-metadata", uploadSPLData.fileName, uploadSPLData.uuid)
		const metadataJSONUrl = await AwsStorageService.getInstance().uploadJSON(uploadSPLData, uploadJSONS3Key)
		if (metadataJSONUrl === undefined) return res.status(400).json({ message: "Unable to upload JSON" })

		const creatorWallet = await findSolanaWallet(creator.user_id, "DEVNET")
		if (_.isNull(creatorWallet) || creatorWallet === undefined) {
			return res.status(400).json({ message: "Unable to find Devnet Solana Wallet" })
		}

		const splTokenPublicKey = await createSPLToken(metadataJSONUrl, uploadSPLData, creatorWallet)
		if (splTokenPublicKey === undefined) return res.status(400).json({ message: "Unable to create NFT" })

		const addSPLResponse = await addSPLRecord(addNFTResponse, splTokenPublicKey)
		if (addSPLResponse === undefined) return res.status(400).json({ message: "Unable to save SPL to DB" })

		await AwsStorageService.getInstance().updateJSONInS3(uploadJSONS3Key, splTokenPublicKey.toString())

		const assignSPLTokenSharesResponse = await assignSPLTokenShares(
			splTokenPublicKey,
			creatorWallet.public_key as unknown as PublicKey,
			uploadSPLData,
			addSPLResponse.spl_id
		)
		if (assignSPLTokenSharesResponse === undefined) {
			return res.status(400).json({ message: "Unable to assign SPL Tokens" })
		}

		await addSPLOwnershipRecord(
			addSPLResponse,
			assignSPLTokenSharesResponse.fiftyoneTokenAccount.address,
			uploadSPLData.numberOfShares * (1 / 100)
		)

		await addSPLOwnershipRecord(
			addSPLResponse,
			assignSPLTokenSharesResponse.creatorTokenAccount.address,
			uploadSPLData.numberOfShares * (uploadSPLData.creatorOwnershipPercentage / 100)
		)

		await addSPLOwnershipRecord(
			addSPLResponse,
			assignSPLTokenSharesResponse.fiftyoneEscrowTokenAccount.address,
			uploadSPLData.numberOfShares * ((99 - uploadSPLData.creatorOwnershipPercentage) / 100)
		)

		return res.status(200).json({ splTokenPublicKey })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Upload File and Mint NFT" })
	}
}
