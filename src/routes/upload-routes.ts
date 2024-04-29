import multer from "multer"
import express from "express"

import uploadImageToS3 from "../controllers/upload/upload-image-to-s3"
import uploadVideoToS3 from "../controllers/upload/upload-video-to-s3"
import uploadProfilePictureImage from "../controllers/upload/upload-profile-picture"

import confirmUserIsCreator from "../middleware/confirm-user-is-creator"
import validateVideoType from "../middleware/request-validation/upload/validate-video-type"
import validateImageType from "../middleware/request-validation/upload/validate-image-type"
import validateUploadImageToS3 from "../middleware/request-validation/upload/validate-upload-image-to-s3"

const uploadRoutes = express.Router()
const upload = multer()

uploadRoutes.post(
	"/upload-video-to-s3",
	confirmUserIsCreator,
	upload.single("file"),
	validateVideoType,
	uploadVideoToS3
)

uploadRoutes.post(
	"/upload-image-to-s3",
	confirmUserIsCreator,
	upload.single("file"),
	validateImageType,
	validateUploadImageToS3,
	uploadImageToS3
)

uploadRoutes.post(
	"/upload-profile-picture",
	upload.single("file"),
	validateImageType,
	uploadProfilePictureImage
)

export default uploadRoutes
