import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const youtubeAuthCallbackSchema = Joi.object({
	code: Joi.string().required()
}).required()

export default function validateYouTubeAuthCallback (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = youtubeAuthCallbackSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate YouTube Auth Callback" })
	}
}
