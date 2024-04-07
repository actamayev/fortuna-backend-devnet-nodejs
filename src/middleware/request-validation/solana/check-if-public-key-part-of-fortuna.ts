import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import checkIfPublicKeyRegisteredWithFortuna from "../../../utils/db-operations/read/search/check-if-public-key-registered-with-fortuna"

export default async function checkIfPublicKeyPartOfFortuna (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const transferSolData = req.body.transferSolData as TransferSolData
		if (!_.isEqual(transferSolData.sendingToPublicKeyOrUsername, "public key")) {
			next()
			return
		}
		const publicKey = req.publicKey
		const isPKRegisteredWithFortuna = await checkIfPublicKeyRegisteredWithFortuna(publicKey.toString())
		if (isPKRegisteredWithFortuna === undefined) return res.status(500).json({
			error: "Internal Server Error: Unable to check if public key registered with Fortuna"
		})
		req.isRecipientFortunaUser = isPKRegisteredWithFortuna
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Sol Transfer" })
	}
}
