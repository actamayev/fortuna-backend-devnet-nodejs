import _ from "lodash"
import { Request, Response } from "express"
import addSplPurchaseRecord from "../../utils/db-operations/write/spl-purchase/add-spl-purchase-record"
import transferSplTokensToUser from "../../utils/solana/purchase-spl-tokens/transfer-spl-tokens-to-user"
import transferSolFromUserToCreator from "../../utils/solana/purchase-spl-tokens/transfer-sol-from-user-to-creator"
import retrieveCreatorPublicKeyFromSpl from "../../utils/db-operations/read/spl/retrieve-creator-public-key-from-spl"

export default async function purchaseSplTokens(req: Request, res: Response): Promise<Response> {
	try {
		const solanaWallet = req.solanaWallet
		const purchaseSplTokensData = req.body.purchaseSplTokensData as PurchaseSPLTokensData
		const splDetails = req.splDetails
		// FUTURE TODO: See if there's a way to simultaneously transfer Spl tokens to user and transfer sol from user to creator
		// Better for this to be done as one transaction (so that if either one fails, neither go through)

		// transfer spl from escrow to user (fortuna wallet should cover transaction)
		// as part of the transfer to user, may need to create a token account for the user.
		// record the transaction (save to spl_transfer table)
		const splTransferId = await transferSplTokensToUser(solanaWallet, purchaseSplTokensData, splDetails)

		const creatorPublicKeyAndWalletId = await retrieveCreatorPublicKeyFromSpl(splDetails.splId)
		if (_.isNull(creatorPublicKeyAndWalletId)) return res.status(500).json({ error: "Unable to find creator's public key" })

		// transfer sol from user to creator (fortuna wallet should cover transaction)
		// record the transaction (save to sol_transfer table)
		const solTransferId = await transferSolFromUserToCreator(
			solanaWallet,
			creatorPublicKeyAndWalletId,
			purchaseSplTokensData.numberOfTokensPurchasing * splDetails.listingPricePerShareSol
		)

		// record to spl_purchase table:
		await addSplPurchaseRecord(splDetails.splId, splTransferId, solTransferId)

		return res.status(200).json({ success: `Purchased ${purchaseSplTokensData.numberOfTokensPurchasing} tokens` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to complete purchase of Spl token(s)"})
	}
}
