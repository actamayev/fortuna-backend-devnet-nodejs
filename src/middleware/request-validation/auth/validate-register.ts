import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import usernameValidator from "../../joi/username-validator"
import passwordValidatorSchema from "../../joi/password-validator"

const registerInformationSchema = Joi.object({
	registerInformation: Joi.object({
		contact: Joi.string().required(),
		username: usernameValidator.required().trim(),
		password: passwordValidatorSchema.required(),
		siteTheme: Joi.string().required().trim().valid("light", "dark")
	}).required()
}).required()

export default function validateRegister (req: Request, res: Response, next: NextFunction): Response | void {
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
