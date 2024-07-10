import _ from "lodash"
import { Request, Response } from "express"
import AwsS3 from "../../classes/aws-s3"
import { createS3KeyGenerateUUID } from "../../utils/s3/create-s3-key"
import updateVideoThumbnail from "../../db-operations/write/video/update-video-thumbnail-id"
import addUploadImageRecord from "../../db-operations/write/uploaded-image/add-upload-image-record"

export default async function uploadNewThumbnailPicture (req: Request, res: Response): Promise<Response> {
	try {
		if (_.isUndefined(req.file)) return res.status(400).json({ message: "No image uploaded" })

		const { buffer, originalname } = req.file
		const { videoId } = req.body

		const uploadThumbnailToS3Key = createS3KeyGenerateUUID("uploaded-images")
		const imageUploadUrl = await AwsS3.getInstance().uploadImage(buffer, uploadThumbnailToS3Key.key)

		const uploadedImageId = await addUploadImageRecord(imageUploadUrl, originalname)

		await updateVideoThumbnail(videoId, uploadedImageId)

		return res.status(200).json({ imageUploadUrl })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Upload Thumbnail" })
	}
}
