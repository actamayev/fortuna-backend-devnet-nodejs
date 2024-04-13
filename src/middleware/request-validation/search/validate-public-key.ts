import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import publicKeyValidator from "../../joi/public-key-validator"

const publicKeySchema = Joi.object({
	publicKey: publicKeyValidator.required().trim()
}).required()

export default function validatePublicKey (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = publicKeySchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Public Key" })
	}
}
