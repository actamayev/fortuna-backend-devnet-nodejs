import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const registerInformationSchema = Joi.object({
	registerInformation: Joi.object({
		contact: Joi.string().required(),
		// Makes sure that the username does not contain an @ symbol, as that is reserved for the contact field
		username: Joi.string().required().pattern(new RegExp("^[^@]*$")),
		password: Joi.string().min(6).required(),
		userType: Joi.string().valid("creator", "supporter").required()
	}).required()
}).required()

export default function validateRegister (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = registerInformationSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const trimmedContact = req.body.registerInformation.contact.trimEnd()
		req.body.registerInformation.contact = trimmedContact
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Registration" })
	}
}
