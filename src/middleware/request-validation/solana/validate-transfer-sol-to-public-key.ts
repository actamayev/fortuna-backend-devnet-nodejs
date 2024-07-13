import Joi from "joi"
import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import { Request, Response, NextFunction } from "express"
import publicKeyValidator from "../../joi/public-key-validator"
import currencyValidatorSchema from "../../joi/currency-validator"

const transferSolToPublicKeySchema = Joi.object({
	moneyTransferData: Joi.object({
		sendingTo: publicKeyValidator.required().trim(),
		transferAmount: Joi.number().strict().required(),
		transferCurrency: currencyValidatorSchema
	}).required()
}).required()

export default function validateTransferSolToPublicKey (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = transferSolToPublicKeySchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })
		const moneyTransferData = req.body.moneyTransferData as MoneyTransferData

		const recipientPublicKey = new PublicKey(moneyTransferData.sendingTo)

		req.recipientPublicKey = recipientPublicKey
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Transfer Sol to Public Key" })
	}
}
