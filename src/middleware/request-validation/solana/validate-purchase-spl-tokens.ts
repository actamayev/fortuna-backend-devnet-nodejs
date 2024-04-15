import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import publicKeyValidator from "../../joi/public-key-validator"

const purchaseSplTokensSchema = Joi.object({
	purchaseSplTokensData: Joi.object({
		numberOfTokensPurchasing: Joi.number().strict().required(),
		splPublicKey: publicKeyValidator.required().trim()
	}).required()
}).required()

export default function validatePurchaseSplTokens (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = purchaseSplTokensSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Transfer Sol to Public Key" })
	}
}
