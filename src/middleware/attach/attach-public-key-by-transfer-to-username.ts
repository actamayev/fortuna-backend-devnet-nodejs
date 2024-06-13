import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import { Request, Response, NextFunction } from "express"
import findPublicKeyAndSolWalletFromUsername from "../../db-operations/read/find/find-public-key-and-sol-wallet-from-username"

export default async function attachPublicKeyByTransferToUsername (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const transferFundsData = req.body.transferFundsData as TransferFundsData

		const recipientUserPublicKeyAndWalletId = await findPublicKeyAndSolWalletFromUsername(transferFundsData.sendingTo)
		if (_.isNull(recipientUserPublicKeyAndWalletId)) {
			return res.status(500).json({ error: "Unable to public key and wallet id" })
		}
		req.isRecipientFortunaWallet = true
		req.recipientSolanaWalletId = recipientUserPublicKeyAndWalletId.solana_wallet_id
		const recipientPublicKey = new PublicKey(recipientUserPublicKeyAndWalletId.public_key)

		req.recipientPublicKey = recipientPublicKey
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Attach public key by transfer details" })
	}
}
