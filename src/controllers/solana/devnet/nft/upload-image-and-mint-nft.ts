import _ from "lodash"
import { Request, Response } from "express"
import { PublicKey } from "@solana/web3.js"
import mintSolanaNFT from "../../../../utils/solana/mint-solana-nft"
import createSPLToken from "../../../../utils/solana/create-spl-token"
import AwsStorageService from "../../../../classes/aws-storage-service"
import findSolanaWallet from "../../../../utils/find/find-solana-wallet"
import transferNFTToCreator from "../../../../utils/solana/transfer-nft-to-creator"
import assignSPLTokenShares from "../../../../utils/solana/assign-spl-token-shares"
import addNFTRecord from "../../../../utils/db-operations/nft/add-nft-record"
import addSPLRecord from "../../../../utils/db-operations/spl/add-spl-record"
import { createS3Key, createS3KeyGenerateUUID } from "../../../../utils/s3/create-s3-key"
import createNFTMetadataJSONForS3 from "../../../../utils/s3/create-nft-metadata-json-for-s3"
import addNFTOwnershipRecord from "../../../../utils/db-operations/nft/add-nft-ownership-record"
import addSPLOwnershipRecord from "../../../../utils/db-operations/spl/add-spl-ownership-record"

// eslint-disable-next-line complexity, max-lines-per-function
export default async function uploadFileAndMintNFT (req: Request, res: Response): Promise<Response> {
	try {
		if (_.isUndefined(req.file)) return res.status(400).json({ message: "No file uploaded" })

		const creator = req.user
		const uploadNFTData = req.body.uploadNFTData as UploadNFT

		const fileBuffer = req.file.buffer
		const fileName = req.file.originalname

		const creatorWallet = await findSolanaWallet(creator.user_id, "DEVNET")
		if (_.isNull(creatorWallet) || creatorWallet === undefined) {
			return res.status(400).json({ message: "Unable to find Devnet Solana Wallet" })
		}

		const uploadImageToS3KeyAndUUID = createS3KeyGenerateUUID("uploaded-images", fileName)
		const imageUploadUrl = await AwsStorageService.getInstance().uploadImage(fileBuffer, uploadImageToS3KeyAndUUID.key)
		if (imageUploadUrl === undefined) return res.status(400).json({ message: "Unable to Save Image" })

		const nftMetadataJSON = createNFTMetadataJSONForS3(uploadNFTData, imageUploadUrl)
		const uploadJSONS3Key = createS3Key("nft-metadata", fileName, uploadImageToS3KeyAndUUID.uuid)
		const metadataJSONUrl = await AwsStorageService.getInstance().uploadJSON(nftMetadataJSON, uploadJSONS3Key)
		if (metadataJSONUrl === undefined) return res.status(400).json({ message: "Unable to upload JSON" })

		const nft = await mintSolanaNFT(metadataJSONUrl, uploadNFTData)
		if (nft === undefined) return res.status(400).json({ message: "Unable to create NFT" })

		const addNFTResponse = await addNFTRecord(
			metadataJSONUrl,
			fileName,
			nft,
			uploadNFTData
		)
		if (addNFTResponse === undefined) return res.status(400).json({ message: "Unable to save NFT" })

		await addNFTOwnershipRecord(addNFTResponse)

		const splTokenPublicKey = await createSPLToken()
		if (splTokenPublicKey === undefined) return res.status(400).json({ message: "Unable to create SPL Token" })

		const addSPLResponse = await addSPLRecord(addNFTResponse, splTokenPublicKey)
		if (addSPLResponse === undefined) return res.status(400).json({ message: "Unable to save SPL to DB" })

		await AwsStorageService.getInstance().updateJSONInS3(uploadJSONS3Key, splTokenPublicKey.toString())

		const assignSPLTokenSharesResponse = await assignSPLTokenShares(
			splTokenPublicKey,
			creatorWallet.public_key as unknown as PublicKey,
			uploadNFTData,
			addSPLResponse.spl_id
		)
		if (assignSPLTokenSharesResponse === undefined) {
			return res.status(400).json({ message: "Unable to assign SPL Tokens" })
		}

		await addSPLOwnershipRecord(
			addSPLResponse,
			assignSPLTokenSharesResponse.fiftyoneTokenAccount.address,
			uploadNFTData.numberOfShares * (1 / 100)
		)

		await addSPLOwnershipRecord(
			addSPLResponse,
			assignSPLTokenSharesResponse.creatorTokenAccount.address,
			uploadNFTData.numberOfShares * (uploadNFTData.creatorOwnershipPercentage / 100)
		)

		await addSPLOwnershipRecord(
			addSPLResponse,
			assignSPLTokenSharesResponse.fiftyoneEscrowTokenAccount.address,
			uploadNFTData.numberOfShares * ((99 - uploadNFTData.creatorOwnershipPercentage) / 100)
		)

		await transferNFTToCreator(splTokenPublicKey, creatorWallet.public_key as unknown as PublicKey)

		return res.status(200).json({ nft })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Upload File and Mint NFT" })
	}
}
