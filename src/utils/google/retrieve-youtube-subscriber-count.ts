import _ from "lodash"
import { google } from "googleapis"

export default async function retrieveYouTubeSubscriberCount(accessToken: string): Promise<number | null> {
	try {
		const auth = new google.auth.OAuth2()
		auth.setCredentials({ access_token: accessToken })
		const youtubeApi = google.youtube({ version: "v3", auth })

		const creatorYouTubeData = await youtubeApi.channels.list({
			part: ["statistics"],
			mine: true
		})

		if (_.isUndefined(creatorYouTubeData.data.items)) return null

		const subscribers = creatorYouTubeData.data.items[0].statistics?.subscriberCount

		if (_.isNil(subscribers)) return null

		return parseInt(subscribers, 10)
	} catch (error) {
		console.error(error)
		throw error
	}
}
