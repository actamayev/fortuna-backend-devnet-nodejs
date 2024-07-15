export default function transformExclusiveContentList(myExclusiveContentList: RetrievedMyExclusiveContentData[]): MyExclusiveContentData[] {
	try {
		return myExclusiveContentList.map(exclusiveContent => ({
			videoName: exclusiveContent.video.video_name,
			imageUrl: exclusiveContent.video.uploaded_image.image_url,
			uuid: exclusiveContent.video.uuid,
			videoDurationSeconds: exclusiveContent.video.uploaded_video.video_duration_seconds
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
