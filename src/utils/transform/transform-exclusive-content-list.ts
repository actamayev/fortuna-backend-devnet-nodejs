export function transformExclusiveContentList(myExclusiveContentList: RetrievedMyExclusiveContentData[]): MyExclusiveContentData[] {
	try {
		const transformedExclusiveContentList: MyExclusiveContentData[] = myExclusiveContentList.map(exclusiveContent => ({
			splName: exclusiveContent.spl.spl_name,
			imageUrl: exclusiveContent.spl.uploaded_image.image_url,
			uuid: exclusiveContent.spl.uploaded_image.uuid
		}))

		return transformedExclusiveContentList
	} catch (error) {
		console.error(error)
		throw error
	}
}
