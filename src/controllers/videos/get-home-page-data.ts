import { Response, Request } from "express"
import retrieveHomePageVideos from "../../db-operations/read/video/retrieve-home-page-videos"
import transformHomePageVideoData from "../../utils/transform/videos/transform-home-page-video-data"
import retrieveMostPopularChannels from "../../db-operations/read/video/retrieve-most-popular-channels"
import transformHomePageCreatorData from "../../utils/transform/creator/transform-home-page-creator-data"
import retrieveHomePageCreatorsById from "../../db-operations/read/credentials/retrieve-home-page-creators-by-id"

export default async function getHomePageData (req: Request, res: Response): Promise<Response> {
	try {
		const { optionallyAttachedUser } = req
		const videoData = await retrieveHomePageVideos()
		const homePageVideos = await transformHomePageVideoData(videoData, optionallyAttachedUser)

		const mostPopularChannels = await retrieveMostPopularChannels()
		const homePageCreatorsById = await retrieveHomePageCreatorsById(mostPopularChannels)
		const homePageCreatorData = transformHomePageCreatorData(homePageCreatorsById)

		return res.status(200).json({ homePageVideos, homePageCreatorData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get home page data" })
	}
}
