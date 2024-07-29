import _ from "lodash"
import { Request, Response } from "express"
import upsertVideoTag from "../../../db-operations/write/video-tag-mapping/upsert-video-tag"
import addTagToLookupAndMapping from "../../../db-operations/write/simultaneous-writes/add-tag-to-lookup-and-mapping"
import retrieveVideoTagIdByTagName from "../../../db-operations/read/video-tag-lookup/retrieve-video-tag-id-by-tag-name"

export default async function addTagToVideo (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const { videoId, videoTag } = req.body

		let videoTagId = await retrieveVideoTagIdByTagName(videoTag)

		if (!_.isUndefined(videoTagId)) {
			// If the tag exists in the lookup table, then add/update the tag record in the mapping table
			await upsertVideoTag(videoId, videoTagId)
		} else {
			//If the tag the user is trying to add does not exist:
			videoTagId = await addTagToLookupAndMapping(videoId, videoTag, user.user_id)
		}

		return res.status(200).json({ videoTagId })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to add tag to video" })
	}
}
