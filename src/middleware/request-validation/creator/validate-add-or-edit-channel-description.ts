import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const addOrEditChannelDescriptionSchema = Joi.object({
	channelDescription: Joi.string().max(60).required()
}).required()

export default function validateAddOrEditChannelDescription (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = addOrEditChannelDescriptionSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Add or Edit Channel Description" })
	}
}
