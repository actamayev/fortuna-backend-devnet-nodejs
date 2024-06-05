import { Request, Response } from "express"
import retrieveVideosByTitle from "../../db-operations/read/video/retrieve-videos-by-title"
import transformCreatorSearchData from "../../utils/transform/transform-creator-search-data"
import transformHomePageVideoData from "../../utils/transform/transform-home-page-video-data"
import retrieveCreatorsByUsername from "../../db-operations/read/credentials/retrieve-creators-by-username"

export default async function generalSearch(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet as ExtendedSolanaWallet | undefined

		const searchTerm = req.params.searchTerm as string

		const videos = await retrieveVideosByTitle(searchTerm)
		const creators = await retrieveCreatorsByUsername(searchTerm)
		const transformedCreatorData = transformCreatorSearchData(creators)
		const transformedVideoSearchData = await transformHomePageVideoData(videos, solanaWallet?.solana_wallet_id)
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
