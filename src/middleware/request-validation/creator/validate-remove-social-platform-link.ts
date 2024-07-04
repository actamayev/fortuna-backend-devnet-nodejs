import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import socialPlatformValidator from "../../joi/social-platform-validator"

const removeSocialPlatformLinkSchema = Joi.object({
	socialPlatform: Joi.string().custom(socialPlatformValidator, "Social Platform validation").required()
}).required()

export default function validateRemoveSocialPlatformLink (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = removeSocialPlatformLinkSchema.validate(req.params)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Delete Social Platform Link" })
	}
}
