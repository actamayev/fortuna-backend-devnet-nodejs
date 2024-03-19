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

		const secretKeyUint8Array = bs58.decode(wallet.secretKey)

		const nft = await mintNFT(metaDataUrl, secretKeyUint8Array)

		await prismaClient.nFT.create({
			data: {
				userId: user.user_id,
				walletId: wallet.id,
				metaDataUrl,
				fileName,
				nftName: nft.name,
				mintAddress: nft.mint.toString(),
				description: "Test Description"
			}
		})
		return res.status(200).json({ success: "Uploaded and minted", nft })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Upload File and Mint NFT" })
	}
}
