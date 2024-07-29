import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import idValidator from "../../joi/id-validator"

const editVideoDescriptionSchema = Joi.object({
	videoDescription: Joi.string().max(5000).required(),
	videoId: idValidator.required()
}).required()

export default function validateEditVideoDescription (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = editVideoDescriptionSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Edit Video Description" })
	}
}
