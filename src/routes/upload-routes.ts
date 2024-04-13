import multer from "multer"
import express from "express"

import uploadImageToS3 from "../controllers/upload/upload-image-to-s3"
import uploadVideoToS3 from "../controllers/upload/upload-video-to-s3"

import validateVideoType from "../middleware/request-validation/upload/validate-video-type"
import validateImageType from "../middleware/request-validation/upload/validate-image-type"
import validateUploadImageToS3 from "../middleware/request-validation/upload/validate-upload-image-to-s3"

const uploadRoutes = express.Router()
const upload = multer()

uploadRoutes.post(
	"/upload-video-to-s3",
	upload.single("file"),
	validateVideoType,
	uploadVideoToS3
)

uploadRoutes.post(
	"/upload-image-to-s3",
	upload.single("file"),
	validateImageType,
	validateUploadImageToS3,
	uploadImageToS3
)

export default uploadRoutes
