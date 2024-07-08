import _ from "lodash"
import { Request, Response } from "express"
import AwsS3 from "../../classes/aws-s3"
import { createS3KeyGenerateUUID } from "../../utils/s3/create-s3-key"
import upsertChannelBannerPictureAndUpdateUser
	from "../../db-operations/write/simultaneous-writes/upsert-channel-banner-picture-and-update-user"

export default async function uploadChannelBannerPicture (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		if (_.isUndefined(req.file)) return res.status(400).json({ message: "No image uploaded" })

		const { buffer, originalname } = req.file

		const uploadImageToS3Key = createS3KeyGenerateUUID("channel-banner-pictures")
		const channelBannerPictureUrl = await AwsS3.getInstance().uploadImage(buffer, uploadImageToS3Key.key)

		await upsertChannelBannerPictureAndUpdateUser(channelBannerPictureUrl, originalname, uploadImageToS3Key.uuid, user.user_id)

		return res.status(200).json({ channelBannerPictureUrl })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Upload Channel Banner Picture" })
	}
}
