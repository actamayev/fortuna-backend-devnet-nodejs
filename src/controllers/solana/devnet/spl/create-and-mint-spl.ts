import _ from "lodash"
import { Request, Response } from "express"
import { PublicKey } from "@solana/web3.js"
import { createS3Key } from "../../../../utils/s3/create-s3-key"
import createSPLToken from "../../../../utils/solana/create-spl-token"
import AwsStorageService from "../../../../classes/aws-storage-service"
import getSolPriceInUSD from "../../../../utils/solana/get-sol-price-in-usd"
import addSPLRecord from "../../../../utils/db-operations/spl/add-spl-record"
import assignSPLTokenShares from "../../../../utils/solana/assign-spl-token-shares"
import { findSolanaWalletByPublicKey } from "../../../../utils/find/find-solana-wallet"

// eslint-disable-next-line complexity, max-lines-per-function
export default async function createAndMintSPL (req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet
		const newSPLData = req.body.newSPLData as NewSPLData

		const solPriceInUSD = await getSolPriceInUSD()
		if (_.isNull(solPriceInUSD)) return res.status(400).json({ message: "Unable to retrieve Sol Price" })

		const uploadJSONS3Key = createS3Key("spl-metadata", newSPLData.fileName, newSPLData.uuid)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { uuid, uploadedImageId, ...restOfNewSPLData } = newSPLData
		const metadataJSONUrl = await AwsStorageService.getInstance().uploadJSON(restOfNewSPLData, uploadJSONS3Key)
		if (metadataJSONUrl === undefined) return res.status(400).json({ message: "Unable to upload JSON" })

		const createSPLResponse = await createSPLToken(metadataJSONUrl, newSPLData.splName, solPriceInUSD)
		if (createSPLResponse === undefined) return res.status(400).json({ message: "Unable to create NFT" })

		const fortunaWalletDB = await findSolanaWalletByPublicKey(process.env.FORTUNA_WALLET_PUBLIC_KEY, "devnet")
		if (_.isNull(fortunaWalletDB) || fortunaWalletDB === undefined) {
			return res.status(400).json({ message: "Unable to find Fortuna's Solana Wallet" })
		}

		const newSPLId = await addSPLRecord(
			metadataJSONUrl,
			newSPLData,
			createSPLResponse,
			solanaWallet.solana_wallet_id,
			fortunaWalletDB.solana_wallet_id,
			solPriceInUSD
		)
		if (newSPLId === undefined) return res.status(400).json({ message: "Unable to save SPL to DB" })

		await AwsStorageService.getInstance().updateJSONInS3(uploadJSONS3Key, { splTokenPublicKey: createSPLResponse.mint.toString()})

		const creatorPublicKey = new PublicKey(solanaWallet.public_key)
		const assignSPLTokenSharesResponse = await assignSPLTokenShares(
			createSPLResponse.mint,
			creatorPublicKey,
			newSPLData,
			newSPLId,
			solanaWallet.solana_wallet_id,
			fortunaWalletDB.solana_wallet_id,
			solPriceInUSD
		)

		if (!_.isEqual(assignSPLTokenSharesResponse, "success")) {
			return res.status(400).json({ message: "Unable to assign SPL Shares" })
		}

		return res.status(200).json({ newSPLId, mintAddress: createSPLResponse.mint })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Create and Mint NFT" })
	}
}
