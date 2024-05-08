import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const hashStringSchema = Joi.object({
	stringToHash: Joi.string().required()
}).required()

export default function validateHashString (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = hashStringSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: "Invalid string to hash" })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate String to hash" })
	}
}
