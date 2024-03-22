import multer from "multer"
import express from "express"

import uploadImageToS3 from "../controllers/upload/upload-image-to-s3"
import confirmUserHasDevnetSolanaWallet from "../middleware/solana/confirm-user-has-devnet-solana-wallet"

const uploadRoutes = express.Router()
const upload = multer()

uploadRoutes.post(
	"/upload-image-to-s3",
	confirmUserHasDevnetSolanaWallet,
	upload.single("file"),
	uploadImageToS3
)

export default uploadRoutes
