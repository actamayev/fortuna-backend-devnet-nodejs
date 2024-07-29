import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import caseInsensitiveTagValidator from "../../joi/case-insensitive-validator"

const videoTagSchema = Joi.object({
	videoTag: caseInsensitiveTagValidator.string().noInvalidCharacters().max(50).required(),
}).required()

export default function validateVideoTag (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = videoTagSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Video Tag" })
	}
}
