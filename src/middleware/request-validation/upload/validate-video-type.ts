import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function validateVideoType (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const videoMimeTypes = ["video/mp4"]

		if (_.isUndefined(req.file) || !videoMimeTypes.includes(req.file.mimetype)) {
			return res.status(400).json({ validationError: "File is not a valid video." })
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Video Type" })
	}
}
