import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import passwordValidatorSchema from "../../joi/password-validator"

const loginInformationSchema = Joi.object({
	loginInformation: Joi.object({
		contact: Joi.string().required(),
		password: passwordValidatorSchema.required(),
	}).required()
}).required()

export default function validateLogin (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = loginInformationSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const trimmedContact = req.body.loginInformation.contact.trimEnd()
		req.body.loginInformation.contact = trimmedContact

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Login" })
	}
}
