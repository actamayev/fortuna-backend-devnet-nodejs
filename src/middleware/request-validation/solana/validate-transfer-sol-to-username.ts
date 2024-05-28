import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import usernameValidator from "../../joi/username-validator"
import currencyValidatorSchema from "../../joi/currency-validator"

const transferSolToUsernameSchema = Joi.object({
	transferSolData: Joi.object({
		sendingTo: usernameValidator.required().trim(),
		transferAmount: Joi.number().strict().required(),
		transferCurrency: currencyValidatorSchema
	}).required()
}).required()

export default function validateTransferSolToUsername (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = transferSolToUsernameSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Sol Transfer To Username" })
	}
}
