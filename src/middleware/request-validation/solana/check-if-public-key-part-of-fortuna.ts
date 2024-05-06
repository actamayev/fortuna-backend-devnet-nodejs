import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import { findSolanaWalletByPublicKey } from "../../../utils/db-operations/read/find/find-solana-wallet"

export default async function checkIfPublicKeyPartOfFortuna (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const { recipientPublicKey } = req
		const receipientSolanaWallet = await findSolanaWalletByPublicKey(recipientPublicKey.toString())

		req.isRecipientFortunaWallet = !_.isNull(receipientSolanaWallet)
		req.recipientSolanaWalletId = receipientSolanaWallet?.solana_wallet_id
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to check if Public Key part of Fortuna" })
	}
}
