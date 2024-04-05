import _ from "lodash"
import { Request, Response } from "express"
import AwsS3 from "../../classes/aws-s3"
import { createS3KeyGenerateUUID } from "../../utils/s3/create-s3-key"
import addUploadVideoRecord from "../../utils/db-operations/upload/add-upload-video-record"

export default async function uploadVideoToS3 (req: Request, res: Response): Promise<Response> {
	try {
		if (_.isUndefined(req.file)) return res.status(400).json({ message: "No video uploaded" })

		const fileBuffer = req.file.buffer
		const fileName = req.file.originalname

		const uploadVideoToS3KeyAndUUID = createS3KeyGenerateUUID("uploaded-videos", fileName)
		const videoUploadUrl = await AwsS3.getInstance().uploadVideo(fileBuffer, uploadVideoToS3KeyAndUUID.key)
		if (_.isUndefined(videoUploadUrl)) return res.status(400).json({ message: "Unable to Save Video" })

		const uploadedVideoId = await addUploadVideoRecord(videoUploadUrl, fileName, uploadVideoToS3KeyAndUUID.uuid)
		if (uploadedVideoId === undefined) return res.status(400).json({ message: "Unable to Save Details to DB" })

		return res.status(200).json({
			videoUploadUrl,
			uuid: uploadVideoToS3KeyAndUUID.uuid,
			uploadedVideoId
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Upload Video to S3" })
	}
}
