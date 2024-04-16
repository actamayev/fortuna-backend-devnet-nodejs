import Joi from "joi"
import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import { Request, Response, NextFunction } from "express"
import isPublicKeyValid from "../../../utils/solana/is-public-key-valid"

const transferSolSchema = Joi.object({
	transferSolData: Joi.object({
		sendingTo: Joi.string().required(),
		transferAmountSol: Joi.number().strict().required()
	}).required()
}).required()

export default function validateTransferSolToPublicKey (req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { error } = transferSolSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })
		const transferSolData = req.body.transferSolData as TransferSolData

		const isPKValid = isPublicKeyValid(transferSolData.sendingTo)
		if (isPKValid === false) return res.status(400).json({ validationError: "Public Key is not Valid" })
		const recipientPublicKey = new PublicKey(transferSolData.sendingTo)

		req.recipientPublicKey = recipientPublicKey
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Transfer Sol to Public Key" })
	}
}
