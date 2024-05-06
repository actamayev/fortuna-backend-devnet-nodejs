import { Request, Response } from "express"
import transformVideoSearchData from "../../utils/transform/transform-video-search-data"
import transformCreatorSearchData from "../../utils/transform/transform-creator-search-data"
import retrieveVideosByTitle from "../../utils/db-operations/read/spl/retrieve-videos-by-title"
import retrieveCreatorsByUsername from "../../utils/db-operations/read/credentials/retrieve-creators-by-username"

export default async function generalSearch(req: Request, res: Response): Promise<Response> {
	try {
		const { searchTerm } = req.params

		const videos = await retrieveVideosByTitle(searchTerm)
		const creators = await retrieveCreatorsByUsername(searchTerm)
		const transformedCreatorData = transformCreatorSearchData(creators)
		const transformedVideoSearchData = await transformVideoSearchData(videos)
		const searchResults: SearchData[] = [
			...transformedCreatorData,
			...transformedVideoSearchData
		]

		return res.status(200).json({ searchResults })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to complete general search" })
	}
}
