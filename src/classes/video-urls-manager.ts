import _ from "lodash"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import SecretsManager from "./secrets-manager"

interface VideoUrlData {
	videoUrl: string
	expiryTime: Date
}

export default class VideoUrlsManager {
	private static instance: VideoUrlsManager | null = null
	private videoUrlsMap: Map<string, VideoUrlData> = new Map()
	private secretsManagerInstance: SecretsManager
	private s3: S3Client
	private readonly expirySeconds: number = 7200 // 2 hours
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

	public static getInstance(): VideoUrlsManager {
		if (_.isNull(VideoUrlsManager.instance)) {
			VideoUrlsManager.instance = new VideoUrlsManager()
		}
		return VideoUrlsManager.instance
	}

	public async getVideoUrl(uuid: string): Promise<string> {
		try {
			const videoUrlData = this.videoUrlsMap.get(uuid)
			const currentTime = new Date()
			if (_.isUndefined(videoUrlData) || videoUrlData.expiryTime < currentTime) {
				return await this.retrieveVideoUrlFromS3(uuid)
			}
			return videoUrlData.videoUrl
		} catch (error) {
			console.error("Error getting videoUrl", error)
			throw error
		}
	}

	private async retrieveVideoUrlFromS3(uuid: string): Promise<string> {
		try {
			const videoUrl = await this.getSignedVideoUrl(uuid, this.expirySeconds)
			this.videoUrlsMap.set(uuid, {
				videoUrl,
				expiryTime: new Date(Date.now() + this.expirySeconds * 1000)
			})
			return videoUrl
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	private async getSignedVideoUrl(key: string, expiryTimeSeconds: number): Promise<string> {
		try {
			const privateS3Bucket = await this.secretsManagerInstance.getSecret("PRIVATE_S3_BUCKET")
			const params = {
				Bucket: privateS3Bucket,
				Key: `uploaded-videos/${key}`,
				Expires: expiryTimeSeconds
			}
			const command = new GetObjectCommand(params)

			const url = await getSignedUrl(this.s3, command)
			return url
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
