import multer from "multer"
import express from "express"

import uploadVideo from "../controllers/upload/upload-video"
import uploadThumbnailPicture from "../controllers/upload/upload-thumbnail-picture"
import uploadProfilePictureImage from "../controllers/upload/upload-profile-picture"
import uploadNewThumbnailPicture from "../controllers/upload/upload-new-thumbnail-picture"
import uploadChannelBannerPicture from "../controllers/upload/upload-channel-banner-picture"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import validateVideoType from "../middleware/request-validation/upload/validate-video-type"
import validateImageType from "../middleware/request-validation/upload/validate-image-type"
import validateUUIDInBody from "../middleware/request-validation/upload/validate-uuid-in-body"
import validateVideoIdInBody from "../middleware/request-validation/upload/validate-video-id-in-body"

const uploadRoutes = express.Router()
const upload = multer()

uploadRoutes.post(
	"/upload-video",
	upload.single("file"),
	validateVideoType,
	jwtVerifyAttachUser,
	uploadVideo
)

uploadRoutes.post(
	"/upload-thumbnail-picture",
	upload.single("file"),
	validateUUIDInBody,
	validateImageType,
	jwtVerifyAttachUser,
	uploadThumbnailPicture
)

uploadRoutes.post(
	"/upload-new-thumbnail-picture",
	upload.single("file"),
	validateVideoIdInBody,
	validateImageType,
	jwtVerifyAttachUser,
	uploadNewThumbnailPicture
)

uploadRoutes.post(
	"/upload-profile-picture",
	upload.single("file"),
	validateImageType,
	jwtVerifyAttachUser,
	uploadProfilePictureImage
)

uploadRoutes.post(
	"/upload-channel-banner-picture",
	upload.single("file"),
	validateImageType,
	jwtVerifyAttachUser,
	uploadChannelBannerPicture
)

export default uploadRoutes
