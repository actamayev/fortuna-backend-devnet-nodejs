import _ from "lodash"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
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

	public async uploadJSON(jsonData: SPLDataSavedToS3, key: string): Promise<string> {
		try {
			const jsonBuffer = Buffer.from(JSON.stringify(jsonData))
			const publicS3Bucket = await this.secretsManagerInstance.getSecret("PUBLIC_S3_BUCKET")

			const command = new PutObjectCommand({
				Bucket: publicS3Bucket,
				Key: key,
				Body: jsonBuffer,
				ContentType: "application/json"
			})
			await this.s3.send(command)
			const url = `https://${publicS3Bucket}.s3.us-east-1.amazonaws.com/${key}`
			return url
		} catch (error) {
			console.error("Error uploading JSON to S3:", error)
			throw error
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async getJSONFromS3(key: string): Promise<any> {
		try {
			const publicS3Bucket = await this.secretsManagerInstance.getSecret("PUBLIC_S3_BUCKET")

			const command = new GetObjectCommand({
				Bucket: publicS3Bucket,
				Key: key
			})
			// eslint-disable-next-line @typescript-eslint/naming-convention
			const { Body } = await this.s3.send(command)
			const bodyText = await new Response(Body as ReadableStream).text()
			return JSON.parse(bodyText)
		} catch (error) {
			console.error("Error getting JSON from S3:", error)
			throw error
		}
	}

	public async updateJSONInS3(key: string, updates: Record<string, string>): Promise<void> {
		try {
			const currentData = await this.getJSONFromS3(key)
			const updatedData = { ...currentData, ...updates }
			const publicS3Bucket = await this.secretsManagerInstance.getSecret("PUBLIC_S3_BUCKET")

			const command = new PutObjectCommand({
				Bucket: publicS3Bucket,
				Key: key,
				Body: JSON.stringify(updatedData),
				ContentType: "application/json"
			})

			await this.s3.send(command)
		} catch (error) {
			console.error("Error updating JSON in S3:", error)
			throw error
		}
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
