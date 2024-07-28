import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import uuidValidator from "../../joi/uuid-validator"
import customJoi from "../../joi/case-insensitive-validator"

const createVideoSchema = Joi.object({
	newVideoData: Joi.object({
		uuid: uuidValidator.required(),
		uploadedImageId: Joi.number().strict().required(),
		uploadedVideoId: Joi.number().strict().required(),
		videoName: Joi.string().max(100).required(),
		description: Joi.string().max(5000).required(),
		isContentExclusive: Joi.boolean().required(),
		tierData: Joi.array().items(
			Joi.object({
				tierNumber: Joi.number().integer().min(1).max(3).required(),
				purchasesInThisTier: Joi.number().integer().min(1).allow(null).required(),
				tierAccessPriceUsd: Joi.number().min(0).max(100).required()
			})
		).max(3).required(),
		videoTags: customJoi.array().items(
			customJoi.string().noInvalidCharacters().max(50)
		).uniqueCaseInsensitive()
	}).required()
}).required()

export default function validateCreateVideo (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = createVideoSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Create Video Data" })
	}
}
