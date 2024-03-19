import _ from "lodash"
import { v4 as uuidv4 } from "uuid"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

export default class AwsStorageService {
	private static instance: AwsStorageService | null = null
	private s3: S3Client

	private constructor() {
		this.s3 = new S3Client({
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			},

			region: process.env.AWS_REGION,
		})
	}

	public static getInstance(): AwsStorageService {
		if (_.isNull(AwsStorageService.instance)) {
			AwsStorageService.instance = new AwsStorageService()
		}
		return AwsStorageService.instance
	}

	public async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
		const uniqueFileName = `${uuidv4()}-${fileName}`
		const key = `uploaded-files/${uniqueFileName}`

		const metadata = { originalFileName: fileName } // Can add extra cryptographic signature data here

		const command = new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: key,
			Body: fileBuffer,
			ContentType: "image/jpeg",
			Metadata: metadata
		})

		try {
			await this.s3.send(command)
			const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
			return url
		} catch (error) {
			console.error("Error uploading file to S3:", error)
			throw error
		}
	}
}
