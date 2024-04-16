import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function validateImageType (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"]

		if (_.isUndefined(req.file) || !imageMimeTypes.includes(req.file.mimetype)) {
			return res.status(400).json({ validationError: "File is not a valid image." })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Image Type" })
	}
}
