import _ from "lodash"
import { Request, Response } from "express"
import AwsS3 from "../../classes/aws-s3"
import { createS3KeyGenerateUUID } from "../../utils/s3/create-s3-key"
import addUploadVideoRecord from "../../db-operations/write/uploaded-video/add-upload-video-record"

export default async function uploadVideoToS3 (req: Request, res: Response): Promise<Response> {
	try {
		if (_.isUndefined(req.file)) return res.status(400).json({ message: "No video uploaded" })

		const { buffer, originalname } = req.file

		const uploadVideoToS3KeyAndUUID = createS3KeyGenerateUUID("uploaded-videos")
		await AwsS3.getInstance().uploadVideo(buffer, uploadVideoToS3KeyAndUUID.key)

		const uploadedVideoId = await addUploadVideoRecord(originalname)

		return res.status(200).json({
			uuid: uploadVideoToS3KeyAndUUID.uuid,
			uploadedVideoId
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Upload Video to S3" })
	}
}
