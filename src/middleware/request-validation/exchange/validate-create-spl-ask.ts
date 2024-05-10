import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import publicKeyValidator from "../../joi/public-key-validator"

const createSplBidSchema = Joi.object({
	createSplAsk: Joi.object({
		splPublicKey: publicKeyValidator.required().trim(),
		numberOfSharesAskingFor: Joi.number().strict().integer().min(1).required(),
		askPricePerShareUsd: Joi.number().greater(0).strict().required()
	}).required()
}).required()

export default function validateCreateSplAsk (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = createSplBidSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate create SPL ask" })
	}
}
