import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import uuidValidator from "../../joi/uuid-validator"

const likeOrUnlikeSchema = Joi.object({
	videoUUID: uuidValidator.required(),
	newLikeStatus: Joi.boolean().required()
}).required()

export default function validateLikeOrUnlike (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = likeOrUnlikeSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Like/Unlike" })
	}
}
