import _ from "lodash"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import SecretsManager from "./secrets-manager"

export default class AwsS3 {
	private static instance: AwsS3 | null = null
	private s3: S3Client
	private secretsManagerInstance: SecretsManager
	private readonly region: string = "us-east-1"

	private constructor() {
		this.secretsManagerInstance = SecretsManager.getInstance()
		this.s3 = new S3Client({
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			},

			region: this.region
		})
	}

	public static getInstance(): AwsS3 {
		if (_.isNull(AwsS3.instance)) {
			AwsS3.instance = new AwsS3()
		}
		return AwsS3.instance
	}

	public async uploadImage(fileBuffer: Buffer, key: string): Promise<string> {
		try {
			return await this.uploadFile(fileBuffer, key, "image/jpeg", "Public")
		} catch (error) {
			console.error("Error uploading image to S3:", error)
			throw error
		}
	}

	public async uploadVideo(fileBuffer: Buffer, key: string): Promise<void> {
		try {
			// eslint-disable-next-line max-len
			await this.uploadFile(fileBuffer, key, "video/mp4", "Private") // Can't just return the uploadFile url since it's a private bucket
		} catch (error) {
			console.error("Error uploading video to S3:", error)
			throw error
		}
	}

	private async uploadFile(
		fileBuffer: Buffer,
		key: string,
		contentType: string,
		publicOrPrivate: PublicOrPrivate
	): Promise<string> {
		try {
			let s3BucketName: string
			if (publicOrPrivate === "Private") {
				s3BucketName = await this.secretsManagerInstance.getSecret("PRIVATE_S3_BUCKET")
			} else {
				s3BucketName = await this.secretsManagerInstance.getSecret("PUBLIC_S3_BUCKET")
			}

			const command = new PutObjectCommand({
				Bucket: s3BucketName,
				Key: key,
				Body: fileBuffer,
				ContentType: contentType
			})
			await this.s3.send(command)
			const url = `https://${s3BucketName}.s3.us-east-1.amazonaws.com/${key}`
			return url
		} catch (error) {
			console.error("Error uploading file to S3:", error)
			throw error
		}
	}
}
