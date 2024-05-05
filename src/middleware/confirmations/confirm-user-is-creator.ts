import { Request, Response, NextFunction } from "express"

export default function confirmUserIsCreator (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { user } = req

		if (user.is_approved_to_be_creator === false) {
			return res.status(400).json({ validationError: "User is not approved to be a creator" })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to confirm if user is approved to be a creator" })
	}
}
