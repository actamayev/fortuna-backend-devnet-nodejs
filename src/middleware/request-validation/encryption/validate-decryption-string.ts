import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const decryptionStringSchema = Joi.object({
	stringToDecrypt: Joi.string().required(),
	encryptionKeyName: Joi.string().required()
}).required()

export default function validateDecryptionString (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = decryptionStringSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: "Invalid string to Decrypt" })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate String to Decrypt" })
	}
}
