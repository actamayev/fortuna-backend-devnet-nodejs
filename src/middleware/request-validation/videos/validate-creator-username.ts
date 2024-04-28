import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const creatorUsernameSchema = Joi.object({
	creatorUsername: Joi.string().required()
}).required()

export default function validateCreatorUsername (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = creatorUsernameSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Creator Username" })
	}
}
