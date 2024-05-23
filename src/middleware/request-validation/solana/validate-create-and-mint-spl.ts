import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import uuidValidator from "../../joi/uuid-validator"

const createAndMintSPLSchema = Joi.object({
	newSPLData: Joi.object({
		splName: Joi.string().required(),
		numberOfShares: Joi.number().strict().min(10).max(1000).required(),
		creatorOwnershipPercentage: Joi.number().strict().min(50).max(90).required(),
		listingSharePriceUsd: Joi.number().strict().required(),
		imageUrl: Joi.string().required(),
		videoUrl: Joi.string().required(),
		uuid: uuidValidator.required(),
		uploadedImageId: Joi.number().strict().required(),
		uploadedVideoId: Joi.number().strict().required(),
		description: Joi.string().required(),
		originalContentUrl: Joi.string().required().allow(""),
		isContentExclusive: Joi.boolean().required(),
		valueNeededToAccessExclusiveContentUsd: Joi.number().optional(),
		listingPriceToAccessExclusiveContentUsd: Joi.number().optional(),
		allowValueFromSameCreatorTokensForExclusiveContent: Joi.boolean().optional(),
	}).required()
}).required()

export default function validateCreateAndMintSPL (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = createAndMintSPLSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Create and Mint SPL Data" })
	}
}
