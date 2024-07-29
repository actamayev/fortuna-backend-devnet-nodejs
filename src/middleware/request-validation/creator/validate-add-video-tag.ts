import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const addVideoTagSchema = Joi.object({
	videoTag: Joi.string().required().max(50),
	videoId: Joi.number().integer().required()
}).required()

export default function validateAddVideoTag (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = addVideoTagSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate add video tag" })
	}
}
