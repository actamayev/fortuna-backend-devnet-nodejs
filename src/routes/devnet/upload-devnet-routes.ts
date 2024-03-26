import multer from "multer"
import express from "express"

import uploadImageToS3 from "../../controllers/upload/upload-image-to-s3"

import attachDevnetSolanaWalletByUserId from "../../middleware/attach/attach-devnet-solana-wallet-by-user-id"

const uploadDevnetRoutes = express.Router()
const upload = multer()

uploadDevnetRoutes.post(
	"/upload-image-to-s3",
	// The solanaWallet isn't used in the upload. This check here to make sure the user has a wallet before uploading anything
	attachDevnetSolanaWalletByUserId,
	upload.single("file"),
	uploadImageToS3
)

export default uploadDevnetRoutes
