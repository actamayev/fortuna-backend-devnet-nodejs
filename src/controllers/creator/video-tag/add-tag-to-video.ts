import _ from "lodash"
import { Request, Response } from "express"
import upsertVideoTag from "../../../db-operations/write/video-tag-mapping/upsert-video-tag"
import addTagToLookupAndMapping from "../../../db-operations/write/simultaneous-writes/add-tag-to-lookup-and-mapping"
import retrieveVideoTagIdByTagName from "../../../db-operations/read/video-tag-lookup/retrieve-video-tag-id-by-tag-name"

export default async function addTagToVideo (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const { videoId, videoTag } = req.body

		const videoTagId = await retrieveVideoTagIdByTagName(videoTag)

		if (_.isNull(videoTagId)) {
			//If the tag the user is trying to add does not exist:
			await addTagToLookupAndMapping(videoId, videoTag, user.user_id)
		} else {
			await upsertVideoTag(videoId, videoTagId.video_tag_lookup_id)
		}

		return res.status(200).json({ success: "Added tag to video" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to add tag to video" })
	}
}
