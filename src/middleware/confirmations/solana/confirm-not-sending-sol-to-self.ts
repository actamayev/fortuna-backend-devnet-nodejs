import _ from "lodash"
import { Request, Response, NextFunction } from "express"

export default function confirmNotSendingSolToSelf(req: Request, res: Response, next: NextFunction): Response | void {
	try {
		const { solanaWallet, recipientPublicKey } = req

		if (_.isEqual(solanaWallet.public_key, recipientPublicKey.toString())) {
			return res.status(400).json({ message: "Cannot send sol to self" })
		}

		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Cannot send sol to self" })
	}
}
