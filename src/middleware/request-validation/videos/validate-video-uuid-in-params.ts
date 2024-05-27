import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"
import uuidValidator from "../../joi/uuid-validator"

const videoUUIDInParamsSchema = Joi.object({
	videoUUID: uuidValidator.required()
}).required()

export default function validateVideoUUIDInParams (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = videoUUIDInParamsSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Video UUID" })
	}
}
