import _ from "lodash"
import { video_tag_lookup } from "@prisma/client"
import PrismaClientClass from "../../../classes/prisma-client"

// eslint-disable-next-line max-lines-per-function
export default async function retrieveOrCreateNewVideoTags(
	newVideoTags: string[],
	userId: number
): Promise<VideoTags[]> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()

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
		const newTags = normalizedTags.filter(tag => !existingTagMap[tag])

		// Create new tags in batch and fetch their IDs
		let createdTags: video_tag_lookup[] = []
		if (!_.isEmpty(newTags)) {
			createdTags = await prismaClient.$transaction(async (prisma) => {
				await prisma.video_tag_lookup.createMany({
					data: newTags.map(tag => ({
						video_tag: tag,
						added_by_user_id: userId
					})),
					skipDuplicates: true
				})

				return prisma.video_tag_lookup.findMany({
					where: {
						video_tag: {
							in: newTags,
							mode: "insensitive"
						}
					}
				})
			})
		}

		// Combine existing and newly created tags
		const allTags = existingTags.concat(createdTags)

		// Map to VideoTags interface
		const videoTags: VideoTags[] = allTags.map(tag => ({
			videoTag: tag.video_tag,
			videoTagId: tag.video_tag_lookup_id
		}))

		return videoTags
	} catch (error) {
		console.error(error)
		throw error
	}
}
