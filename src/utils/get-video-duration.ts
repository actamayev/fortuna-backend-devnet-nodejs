import path from "path"
import crypto from "crypto"
import ffmpeg from "fluent-ffmpeg"
import { promises as fs } from "fs"
import ffmpegStatic from "ffmpeg-static"
import ffprobeStatic from "ffprobe-static"

ffmpeg.setFfmpegPath(ffmpegStatic as unknown as string)
ffmpeg.setFfprobePath(ffprobeStatic.path)

export default async function getVideoDuration(buffer: Buffer): Promise<number> {
	const tempDir = path.join("/tmp", "uploads")
	await fs.mkdir(tempDir, { recursive: true }) // Ensure the directory exists
	const tempFileName = crypto.randomBytes(16).toString("hex") + ".mp4"
	const tempFilePath = path.join(tempDir, tempFileName)

	try {
		await fs.writeFile(tempFilePath, buffer)

		const duration = await new Promise<number>((resolve, reject) => {
			ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
				if (err) return reject(err)
				if (!metadata?.format?.duration) return reject(new Error("Duration not found"))
				resolve(metadata.format.duration) // duration in seconds
			})
		})

		await fs.unlink(tempFilePath)

		return duration
	} catch (error) {
		try {
			await fs.unlink(tempFilePath)
		} catch (unlinkErr) {
			console.error("Error deleting temporary file:", unlinkErr)
		}
		console.error("Error processing video file:", error)
		throw error
	}
}
