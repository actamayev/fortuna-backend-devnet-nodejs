import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import currencyValidatorSchema from "../../joi/currency-validator"

const setDefaultCurrencySchema = Joi.object({
	defaultCurrency: currencyValidatorSchema
}).required()

export default function validateSetDefaultCurrency (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = setDefaultCurrencySchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: "Invalid default currency" })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Default Currency" })
	}
}
