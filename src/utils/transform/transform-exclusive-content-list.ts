export function transformExclusiveContentList(myExclusiveContentList: RetrievedMyExclusiveContentData[]): MyExclusiveContentData[] {
	try {
		const transformedExclusiveContentList: MyExclusiveContentData[] = myExclusiveContentList.map(exclusiveContent => ({
			videoName: exclusiveContent.video.video_name,
			imageUrl: exclusiveContent.video.uploaded_image.image_url,
			uuid: exclusiveContent.video.uuid
		}))

		return transformedExclusiveContentList
	} catch (error) {
		console.error(error)
		throw error
	}
}
