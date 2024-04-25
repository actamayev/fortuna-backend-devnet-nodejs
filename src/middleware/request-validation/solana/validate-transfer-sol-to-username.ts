import Joi from "joi"
import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import { Request, Response, NextFunction } from "express"
import { findPublicKeyAndSolWalletFromUsername } from "../../../utils/db-operations/read/find/find-public-key-and-sol-wallet-from-username"

const transferSolToUsernameSchema = Joi.object({
	transferSolData: Joi.object({
		sendingTo: Joi.string().required(),
		transferAmountSol: Joi.number().strict().required(),
		transferAmountUsd: Joi.number().strict().required()
	}).required()
}).required()

export default async function validateTransferSolToUsername (req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { error } = transferSolToUsernameSchema.validate(req.body)

		if (!_.isUndefined(error)) return res.status(400).json({ validationError: error.details[0].message })
		const transferSolData = req.body.transferSolData as TransferSolData

		const recipientUserPublicKeyAndWalletId = await findPublicKeyAndSolWalletFromUsername(transferSolData.sendingTo)
		if (_.isNil(recipientUserPublicKeyAndWalletId)) {
			return res.status(500).json({ error: "Unable to public key and wallet id" })
		}
		req.isRecipientFortunaWallet = true
		req.recipientSolanaWalletId = recipientUserPublicKeyAndWalletId.solana_wallet_id
		const recipientPublicKey = new PublicKey(recipientUserPublicKeyAndWalletId.public_key)

		req.recipientPublicKey = recipientPublicKey
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Sol Transfer To Username" })
	}
}
