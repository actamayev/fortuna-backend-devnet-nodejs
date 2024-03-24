import Joi from "joi"
import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import { Request, Response, NextFunction } from "express"
import publicKeyValidator from "../../joi/public-key-validator"

const transferSolSchema = Joi.object({
	transferData: Joi.object({
		recipientPublicKey: publicKeyValidator.required(),
		transferAmountSol: Joi.number().strict().required()
	}).required()
}).required()

export default function validateTransferSol (req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const { error } = transferSolSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })

		const publicKey = new PublicKey(req.body.transferData.recipientPublicKey)
		req.publicKey = publicKey

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Sol Transfer" })
	}
}
