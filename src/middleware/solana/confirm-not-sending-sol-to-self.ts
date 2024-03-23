import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmNotSendingSolToSelf(req: Request, res: Response, next: NextFunction): void | Response {
	try {
		const recipientPublicKey = req.publicKey
		const solanaWallet = req.solanaWallet

		if (_.isEqual(recipientPublicKey.toString(), solanaWallet.public_key)) {
			return res.status(400).json({ message: "Cannot send sol to self" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Cannot send sol to self" })
	}
}
