import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import publicKeyValidator from "../../joi/public-key-validator"

const transactionFeeSchema = Joi.array().items(publicKeyValidator.required()).required()

export default function validateTransactionSignatures (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = transactionFeeSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Transaction Signatures" })
	}
}
