import { Request, Response } from "express"
import transformExclusiveContentList from "../../utils/transform/videos/transform-exclusive-content-list"
import retrieveExclusiveAccessByWalletId
	from "../../db-operations/read/exclusive-video-access-purchase/retrieve-exclusive-access-by-wallet-id"

export default async function getMyPurchasedExclusiveContent(req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req

		const myExclusiveContent = await retrieveExclusiveAccessByWalletId(user.user_id)
		const myPurchasedExclusiveContent = transformExclusiveContentList(myExclusiveContent)

		return res.status(200).json({ myPurchasedExclusiveContent })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve my ownership" })
	}
}
