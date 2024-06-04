import { Request, Response } from "express"
import AwsS3 from "../../classes/aws-s3"
import { createS3Key } from "../../utils/s3/create-s3-key"
import addSPLRecord from "../../db-operations/write/spl/add-spl-record"
import createSPLToken from "../../utils/solana/create-and-mint-spl/create-spl-token"
import updateSplListingStatus from "../../db-operations/write/spl/update-spl-listing-status"
import assignSPLTokenShares from "../../utils/solana/create-and-mint-spl/assign-spl-token-shares"

export default async function createAndMintSPL (req: Request, res: Response): Promise<Response> {
	try {
		const creatorSolanaWallet = req.solanaWallet
		const newSPLData = req.body.newSPLData as IncomingNewSPLData

		const uploadJSONS3Key = createS3Key("spl-metadata", newSPLData.uuid)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { uuid, uploadedImageId, ...restOfNewSPLData } = newSPLData

		const createSPLResponse = await createSPLToken(metadataJSONUrl, newSPLData.splName)

		const newSPLId = await addSPLRecord(
			metadataJSONUrl,
			newSPLData,
			createSPLResponse,
			creatorSolanaWallet.solana_wallet_id
		)

		await AwsS3.getInstance().updateJSONInS3(uploadJSONS3Key, { splTokenPublicKey: createSPLResponse.mint.toString()})

		await assignSPLTokenShares(
			createSPLResponse.mint,
			newSPLData,
			newSPLId,
			creatorSolanaWallet.solana_wallet_id
		)

		await updateSplListingStatus(newSPLId, "LISTED")

		return res.status(200).json({ newSPLId, mintAddress: createSPLResponse.mint })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create and Mint SPL" })
	}
}
