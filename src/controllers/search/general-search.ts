import { Request, Response } from "express"
import retrieveVideosByTitle from "../../db-operations/read/video/retrieve-videos-by-title"
import transformCreatorSearchData from "../../utils/transform/creator/transform-creator-search-data"
import transformHomePageVideoData from "../../utils/transform/videos/transform-home-page-video-data"
import retrieveCreatorsByUsername from "../../db-operations/read/credentials/retrieve-creators-by-username"

export default async function generalSearch(req: Request, res: Response): Promise<Response> {
	try {
		const { optionallyAttachedSolanaWallet, userId } = req

		const searchTerm = req.params.searchTerm as string

		const videos = await retrieveVideosByTitle(searchTerm)
		const creators = await retrieveCreatorsByUsername(searchTerm)
		const transformedCreatorData = transformCreatorSearchData(creators)
		const transformedVideoSearchData = await transformHomePageVideoData(
			videos,
			optionallyAttachedSolanaWallet?.solana_wallet_id,
			userId
		)
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
