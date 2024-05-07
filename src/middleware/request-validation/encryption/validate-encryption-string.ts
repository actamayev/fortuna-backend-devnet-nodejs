import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const encryptionStringSchema = Joi.object({
	stringToEncrypt: Joi.string().required()
}).required()

export default function validateEncryptionString (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = encryptionStringSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: "Invalid string to encrypt" })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate String to Encrypt" })
	}
}
