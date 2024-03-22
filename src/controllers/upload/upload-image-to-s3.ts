import _ from "lodash"
import { Request, Response } from "express"
import AwsStorageService from "../../classes/aws-storage-service"
import { createS3KeyGenerateUUID } from "../../utils/s3/create-s3-key"

export default async function uploadImageToS3 (req: Request, res: Response): Promise<Response> {
	try {
		if (_.isUndefined(req.file)) return res.status(400).json({ message: "No file uploaded" })

		const fileBuffer = req.file.buffer
		const fileName = req.file.originalname

		const uploadImageToS3KeyAndUUID = createS3KeyGenerateUUID("uploaded-images", fileName)
		const imageUploadUrl = await AwsStorageService.getInstance().uploadImage(fileBuffer, uploadImageToS3KeyAndUUID.key)
		if (imageUploadUrl === undefined) return res.status(400).json({ message: "Unable to Save Image" })

		return res.status(200).json( { imageUploadUrl, fileName, uuid: uploadImageToS3KeyAndUUID.uuid })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Upload Image to S3" })
	}
}
