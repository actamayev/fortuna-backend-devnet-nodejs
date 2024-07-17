import { Response, Request } from "express"
import retrieveYouTubeSubscriberCount from "../../utils/google/retrieve-youtube-subscriber-count"

export default async function getUserYouTubeInfo (req: Request, res: Response): Promise<Response> {
	try {
		const { youtubeAccessToken } = req
		const subscriberCount = await retrieveYouTubeSubscriberCount(youtubeAccessToken)

		return res.status(200).json({ subscriberCount })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve user YouTube info" })
	}
}
