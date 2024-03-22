import type { StreamingBlobPayloadOutputTypes } from "@smithy/types"

export default async function extractJSONDataFromS3(s3RetrievedData: StreamingBlobPayloadOutputTypes): Promise<string | void> {
	try {
		let jsonData = ""
		if (s3RetrievedData instanceof ReadableStream) {
			const reader = s3RetrievedData.getReader()
			const stream = new ReadableStream({
				async start(controller): Promise<void> {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
					while (true) {
						const { done, value } = await reader.read()
						if (done) break
						controller.enqueue(value)
					}
					controller.close()
					reader.releaseLock()
				}
			})

			const response = new Response(stream)
			jsonData = await response.text()
		} else {
			jsonData = s3RetrievedData.toString()
		}

		return jsonData
	} catch (error) {
		console.error(error)
	}
}
