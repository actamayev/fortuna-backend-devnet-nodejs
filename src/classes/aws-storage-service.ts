import _ from "lodash"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"

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

	public async uploadJSON(jsonData: SLPDataSavedToS3, key: string): Promise<string | void> {
		const jsonBuffer = Buffer.from(JSON.stringify(jsonData))

		const command = new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: key,
			Body: jsonBuffer,
			ContentType: "application/json",
		})

		try {
			await this.s3.send(command)
			const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
			return url
		} catch (error) {
			console.error("Error uploading JSON to S3:", error)
			throw error
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async getJSONFromS3(key: string): Promise<any> {
		const command = new GetObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: key,
		})

		try {
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

			const command = new PutObjectCommand({
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: key,
				Body: JSON.stringify(updatedData),
				ContentType: "application/json",
			})

			await this.s3.send(command)
		} catch (error) {
			console.error("Error updating JSON in S3:", error)
			throw error
		}
	}

	public async uploadImage(fileBuffer: Buffer, key: string): Promise<string | void> {
		const command = new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: key,
			Body: fileBuffer,
			ContentType: "image/jpeg",
		})

		try {
			await this.s3.send(command)
			const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
			return url
		} catch (error) {
			console.error("Error uploading image to S3:", error)
			throw error
		}
	}
}
