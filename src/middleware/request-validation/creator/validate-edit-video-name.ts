import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import uuidValidator from "../../joi/uuid-validator"

const editVideoNameSchema = Joi.object({
	videoName: Joi.string().max(100).required(),
	videoUUID: uuidValidator.required()
}).required()

export default function validateEditVideoName (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = editVideoNameSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Edit Video Name" })
	}
}
