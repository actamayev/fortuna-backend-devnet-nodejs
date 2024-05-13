import { Request, Response, NextFunction } from "express"
import checkIfAskByUserExists from "../../../db-operations/read/secondary-market/ask/check-if-active-ask-by-user-exists"

export default async function confirmAskCreator(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { user } = req
		const { splAskId } = req.params
		const askByUserExists = await checkIfAskByUserExists(parseInt(splAskId, 10), user.user_id)

		if (askByUserExists === false) {
			return res.status(400).json({ message: "Ask doesn't belong to the user making the request." })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to confirm ask originator" })
	}
}
