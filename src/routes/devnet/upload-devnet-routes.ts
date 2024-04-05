import multer from "multer"
import express from "express"

import uploadImageToS3 from "../../controllers/upload/upload-image-to-s3"
import uploadVideoToS3 from "../../controllers/upload/upload-video-to-s3"

import validateVideoType from "../../middleware/request-validation/upload/validate-video-type"
import validateImageType from "../../middleware/request-validation/upload/validate-image-type"
import validateUploadImageToS3 from "../../middleware/request-validation/upload/validate-upload-image-to-s3"
import attachDevnetSolanaWalletByUserId from "../../middleware/attach/attach-devnet-solana-wallet-by-user-id"

const uploadDevnetRoutes = express.Router()
const upload = multer()

uploadDevnetRoutes.post(
	"/upload-video-to-s3",
	upload.single("file"),
	validateVideoType,
	// The solanaWallet isn't used in the upload. This check here to make sure the user has a wallet before uploading anything
	attachDevnetSolanaWalletByUserId,
	uploadVideoToS3
)

uploadDevnetRoutes.post(
	"/upload-image-to-s3",
	upload.single("file"),
	validateImageType,
	validateUploadImageToS3,
	uploadImageToS3
)

export default uploadDevnetRoutes
