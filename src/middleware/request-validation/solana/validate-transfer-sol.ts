import Joi from "joi"
import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import { Request, Response, NextFunction } from "express"
import isPublicKeyValid from "../../../utils/solana/is-public-key-valid"
import { findPublicKeyFromUsername } from "../../../utils/db-operations/read/find/find-public-key-from-username"

const transferSolSchema = Joi.object({
	transferSolData: Joi.object({
		sendingTo: Joi.string().required(),
		sendingToPublicKeyOrUsername: Joi.string().required().valid("public key", "username"),
		transferAmountSol: Joi.number().strict().required()
	}).required()
}).required()

export default async function validateTransferSol (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { error } = transferSolSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })
		const transferSolData = req.body.transferSolData as TransferSolData

		let publicKey
		if (_.isEqual(transferSolData.sendingToPublicKeyOrUsername, "public key")) {
			const isPKValid = isPublicKeyValid(transferSolData.sendingTo)
			if (isPKValid === false) return res.status(400).json({ validationError: "Public Key is not Valid" })
			publicKey = new PublicKey(transferSolData.sendingTo)
		} else {
			const recipientUserPublicKey = await findPublicKeyFromUsername(transferSolData.sendingTo)
			if (_.isNull(recipientUserPublicKey)) return res.status(400).json({ validationError: "Unable to find Username" })
			req.isRecipientFortunaUser = true
			publicKey = new PublicKey(recipientUserPublicKey)
		}

		req.publicKey = publicKey
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Sol Transfer" })
	}
}
