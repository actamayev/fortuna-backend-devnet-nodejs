import _ from "lodash"
import { Request, Response } from "express"
import AwsS3 from "../../classes/aws-s3"
import { createS3Key } from "../../utils/s3/create-s3-key"
import addUploadImageRecord from "../../db-operations/write/uploaded-image/add-upload-image-record"

export default async function uploadImageToS3 (req: Request, res: Response): Promise<Response> {
	try {
		if (_.isUndefined(req.file)) return res.status(400).json({ message: "No image uploaded" })

		const { buffer, originalname } = req.file
		const uuid = req.body.uuid

		const uploadImageToS3Key = createS3Key("uploaded-images", originalname, uuid)
		const imageUploadUrl = await AwsS3.getInstance().uploadImage(buffer, uploadImageToS3Key)

		const uploadedImageId = await addUploadImageRecord(imageUploadUrl, originalname, uuid)

		return res.status(200).json({ imageUploadUrl, uploadedImageId })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Upload Image to S3" })
	}
}
