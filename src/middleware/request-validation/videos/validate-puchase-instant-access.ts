import _ from "lodash"
import Joi from "joi"
import { Request, Response, NextFunction } from "express"
import uuidValidator from "../../joi/uuid-validator"

const purchaseInstantAccessSchema = Joi.object({
	videoUUID: uuidValidator.required(),
	tierNumber: Joi.number().strict().required()
}).required()

export default function validatePurchaseInstantAccess (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = purchaseInstantAccessSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Purchase instant access" })
	}
}
