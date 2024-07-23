import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import publicKeyValidator from "../../joi/public-key-validator"

export default function confirmPublicKeyExists(req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { recipientPublicKey } = req.body

		// Validate the recipient public key
		const { error } = publicKeyValidator.validate(recipientPublicKey)
		if (!_.isUndefined(error)) return res.status(400).json({ message: "Invalid recipient public key" })

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to check if public key exists" })
	}
}
