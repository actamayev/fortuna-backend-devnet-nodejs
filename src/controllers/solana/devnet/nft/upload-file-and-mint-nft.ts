import _ from "lodash"
import bs58 from "bs58"
import { Request, Response } from "express"
import mintNFT from "../../../../utils/mint-nft"
import prismaClient from "../../../../prisma-client"
import AwsStorageService from "../../../../classes/aws-storage-service"
import findSolanaWallet from "../../../../utils/find/find-solana-wallet"

export default async function uploadFileAndMintNFT (req: Request, res: Response): Promise<Response> {
	try {
		if (_.isUndefined(req.file)) return res.status(400).json({ message: "No file uploaded" })

		const user = req.user

		const fileBuffer = req.file.buffer
		const fileName = req.file.originalname

		const metaDataUrl = await AwsStorageService.getInstance().uploadFile(fileBuffer, fileName)

		if (_.isUndefined(metaDataUrl)) return res.status(400).json({ message: "Unable to Save Image"})

		const wallet = await findSolanaWallet(user.user_id, "DEVNET")

		if (_.isNil(wallet)) return res.status(400).json({ message: "Unable to find Devnet Solana Wallet"})

		const secretKeyUint8Array = bs58.decode(wallet.secret_key)

		const nft = await mintNFT(metaDataUrl, secretKeyUint8Array, fileName)

		if (_.isUndefined(nft)) return res.status(400).json({ message: "Unable to create NFT"})

		await prismaClient.nFT.create({
			data: {
				user_id: user.user_id,
				wallet_id: wallet.solana_wallet_id,
				meta_data_url: metaDataUrl,
				file_name: fileName,
				nft_name: nft.name,
				chain_address: nft.mint.address.toString(),
				meta_data_address: nft.metadataAddress.toString(),
				// TODO: Create a separate endpoint that allows for future Listing
				// ie. if a creator wants to mint before-hand, and release at the same time as the video drops. This would be "PRELISTING"
				nft_listing_status: "LISTED"
				// description: "Test Description"
			}
		})
		return res.status(200).json({ nft })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Upload File and Mint NFT" })
	}
}
