import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const likeOrDislikeVideoSchema = Joi.object({
	videoId: Joi.number().strict().required(),
	likeStatus: Joi.boolean().required()
}).required()

export default function validateLikeOrDislikeVideo (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = likeOrDislikeVideoSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to validate like of dislike video" })
	}
}
