import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const cancelAskSchema = Joi.object({
	splAskId: Joi.number().strict().integer().min(0).required()
}).required()

export default function validateCancelSplAsk (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = cancelAskSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate cancel SPL ask" })
	}
}
