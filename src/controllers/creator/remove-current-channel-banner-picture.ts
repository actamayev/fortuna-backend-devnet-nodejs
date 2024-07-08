import { Request, Response } from "express"
import markChannelBannerInactive from "../../db-operations/write/credentials/mark-channel-banner-inactive"

export default async function removeCurrentChannelBannerPicture (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req

		await markChannelBannerInactive(user.user_id)

		return res.status(200).json({ success: "Removed Channel Banner picture" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to remove channel banner picture" })
	}
}
