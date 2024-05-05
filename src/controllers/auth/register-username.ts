import _ from "lodash"
import { Response, Request } from "express"
import setUsername from "../../utils/db-operations/write/credentials/set-username"
import doesUsernameExist from "../../utils/db-operations/read/does-x-exist/does-username-exist"

export default async function registerUsername (req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		if (!_.isNull(user.username)) return res.status(400).json({ message: "Username already registered" })
		const { username } = req.body
		const usernameExists = await doesUsernameExist(username)
		if (usernameExists === true) return res.status(400).json({ message: "Username taken" })

		await setUsername(user.user_id, username)

		return res.status(200).json({ success: "Username registered" })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Register username" })
	}
}
