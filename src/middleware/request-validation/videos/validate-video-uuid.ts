import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const videoUUIDSchema = Joi.object({
	videoUUID: Joi.string().uuid({ version: "uuidv4" }).required().trim()
}).required()

export default function validateVideoUUID (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = videoUUIDSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Video UUID" })
	}
}
