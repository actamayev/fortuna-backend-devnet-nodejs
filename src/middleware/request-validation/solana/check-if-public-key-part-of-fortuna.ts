import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import { findSolanaWalletByPublicKey } from "../../../utils/db-operations/read/find/find-solana-wallet"

export default async function checkIfPublicKeyPartOfFortuna (req: Request, res: Response, next: NextFunction): Promise<void | Response> {
	try {
		const publicKey = req.publicKey
		const receipientSolanaWallet = await findSolanaWalletByPublicKey(publicKey.toString(), "devnet")
		if (receipientSolanaWallet === undefined) return res.status(500).json({
			error: "Internal Server Error: Unable to check if public key registered with Fortuna"
		})
		req.isRecipientFortunaWallet = !_.isNull(receipientSolanaWallet)
		req.recipientSolanaWalletId = receipientSolanaWallet?.solana_wallet_id
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Validate Sol Transfer" })
	}
}
