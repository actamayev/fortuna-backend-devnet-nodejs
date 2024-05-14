import { Request, Response, NextFunction } from "express"
import checkIfSplExistsById from "../../../db-operations/read/spl/check-if-spl-exists-by-id"

export default async function confirmSplExistsById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { splId } = req.params
		const splExists = await checkIfSplExistsById(parseInt(splId, 10))

		if (splExists === false) {
			return res.status(400).json({ message: "Couldn't find Spl by Spl id." })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to find Token" })
	}
}
