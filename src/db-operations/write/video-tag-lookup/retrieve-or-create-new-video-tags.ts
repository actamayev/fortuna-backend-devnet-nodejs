import _ from "lodash"
import { video_tag_lookup } from "@prisma/client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveOrCreateNewVideoTags(
	prismaClient: PrismaType,
	newVideoTags: string[],
	userId: number
): Promise<VideoTags[]> {
	try {
		// Normalize tags to lower case
		const normalizedTags = newVideoTags.map(tag => tag.toLowerCase())

		// Fetch all existing tags in one query
		const existingTags = await prismaClient.video_tag_lookup.findMany({
			where: {
				video_tag: {
					in: normalizedTags,
					mode: "insensitive"
				}
			}
		})

		// Map existing tags to their ids
		const existingTagMap = _.keyBy(existingTags, tag => tag.video_tag.toLowerCase())

		// Determine which tags need to be created
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		const newTags = normalizedTags.filter(tag => !existingTagMap[tag])

		// Create new tags in batch and fetch their IDs
		let createdTags: video_tag_lookup[] = []
		if (!_.isEmpty(newTags)) {
			await prismaClient.video_tag_lookup.createMany({
				data: newTags.map(tag => ({
					video_tag: tag,
					added_by_user_id: userId
				})),
				skipDuplicates: true
			})

			createdTags = await prismaClient.video_tag_lookup.findMany({
				where: {
					video_tag: {
						in: newTags,
						mode: "insensitive"
					}
				}
			})
		}

		// Combine existing and newly created tags
		const allTags = existingTags.concat(createdTags)

		// Map to VideoTags interface
		return allTags.map(tag => ({
			videoTag: tag.video_tag,
			videoTagId: tag.video_tag_lookup_id
		}))
	} catch (error) {
		console.error(error)
		throw error
	}
}
