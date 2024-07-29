import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import idValidator from "../../joi/id-validator"

const videoIdInParamsSchema = Joi.object({
	videoId: idValidator.required()
}).required()

export default function validateVideoIdInParams (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = videoIdInParamsSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Video Id" })
	}
}
