import { Request, Response } from "express"
import getUsernames from "../../utils/db-operations/read/search/get-usernames"

export default async function searchForUsername(req: Request, res: Response): Promise<Response> {
	try {
		const user = req.user
		const username = req.params.username as string

		const usernames = await getUsernames(username, user.username)

		return res.status(200).json({ usernames })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Search for username" })
	}
}
