import { Response, Request } from "express"
import transformHomePageVideoData from "../../utils/transform/videos/transform-home-page-video-data"
import retrieveMostPopularChannels from "../../db-operations/read/video/retrieve-most-popular-channels"
import transformHomePageCreatorData from "../../utils/transform/creator/transform-home-page-creator-data"
import retrieveHomePageCreatorsByIds from "../../db-operations/read/credentials/retrieve-home-page-creators-by-ids"
import retrieveMostLikedVideosForHomePage from "../../db-operations/read/video/retrieve-most-liked-videos-for-home-page"
import retrieveMostRecentVideosForHomePage from "../../db-operations/read/video/retrieve-most-recent-videos-for-home-page"

export default async function getHomePageData (req: Request, res: Response): Promise<Response> {
	try {
		const { optionallyAttachedUser } = req
		const retrievedMostRecentVideosForHomePage = await retrieveMostRecentVideosForHomePage()
		const recentlyPostedVideos = await transformHomePageVideoData(retrievedMostRecentVideosForHomePage, optionallyAttachedUser)

		const retrievedMostLikedVideosForHomePage = await retrieveMostLikedVideosForHomePage()
		const mostLikedVideos = await transformHomePageVideoData(retrievedMostLikedVideosForHomePage, optionallyAttachedUser)

		const mostPopularChannels = await retrieveMostPopularChannels()
		const homePageCreatorsById = await retrieveHomePageCreatorsByIds(mostPopularChannels)
		const homePageCreatorData = transformHomePageCreatorData(homePageCreatorsById)

		return res.status(200).json({ recentlyPostedVideos, mostLikedVideos, homePageCreatorData })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to get home page data" })
	}
}
