import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"

const uploadFileAndMintNFTSchema = Joi.object({
	uploadNFTData: Joi.object({
		nftName: Joi.string().required(),
		numberOfShares: Joi.number().min(10).max(1000).required(),
		creatorOwnershipPercentage: Joi.number().min(50).max(90).required(),
		offeringSharePrice: Joi.number().required(),
		description: Joi.string().optional()
	}).required()
}).required()

export default function validateUploadImageAndMintNFT (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = uploadFileAndMintNFTSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Upload File and Mint NFT" })
	}
}
