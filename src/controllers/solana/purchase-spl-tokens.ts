import _ from "lodash"
import { Request, Response } from "express"
import SolPriceManager from "../../classes/sol-price-manager"
import transferSplTokensToUser from "../../utils/solana/purchase-spl-tokens/transfer-spl-tokens-to-user"
import addSplPurchaseRecord from "../../db-operations/write/spl/spl-purchase/add-spl-purchase-record"
import transferSolFromUserToCreator from "../../utils/solana/purchase-spl-tokens/transfer-sol-from-user-to-creator"
import retrieveCreatorWalletInfoFromSpl from "../../db-operations/read/spl/retrieve-creator-wallet-info-from-spl"

export default async function purchaseSplTokens(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet, splDetails } = req
		const purchaseSplTokensData = req.body.purchaseSplTokensData as PurchaseSPLTokensData
		// FUTURE TODO: See if there's a way to simultaneously transfer Spl tokens to user and transfer sol from user to creator
		// Better for this to be done as one transaction (so that if either one fails, neither go through)

		// 1) Transfer spl from escrow to user (fortuna wallet should cover transaction)
		// As part of the transfer to user, may need to create a token account for the user.
		// record the transaction (save to spl_transfer table)
		const splTransferId = await transferSplTokensToUser(solanaWallet, purchaseSplTokensData, splDetails.splId)

		const creatorWalletInfo = await retrieveCreatorWalletInfoFromSpl(splDetails.splId)
		if (_.isUndefined(creatorWalletInfo)) return res.status(500).json({ error: "Unable to find creator's public key" })

		const transferCurrencyAmounts = { solPriceToTransferAt: 0, usdPriceToTransferAt: 0 }

		const solPrice = (await SolPriceManager.getInstance().getPrice()).price
		if (splDetails.listingDefaultCurrency === "sol") {
			transferCurrencyAmounts.solPriceToTransferAt = splDetails.listingSharePrice
			transferCurrencyAmounts.usdPriceToTransferAt = splDetails.listingSharePrice * solPrice
		} else {
			transferCurrencyAmounts.solPriceToTransferAt = splDetails.listingSharePrice / solPrice
			transferCurrencyAmounts.usdPriceToTransferAt = splDetails.listingSharePrice
		}
		// 2) Transfer sol from user to creator (fortuna wallet should cover transaction)
		// Record the transaction (save to sol_transfer table)
		const solTransferId = await transferSolFromUserToCreator(
			solanaWallet,
			creatorWalletInfo,
			{
				solToTransfer: purchaseSplTokensData.numberOfTokensPurchasing * transferCurrencyAmounts.solPriceToTransferAt,
				usdToTransfer: purchaseSplTokensData.numberOfTokensPurchasing * transferCurrencyAmounts.usdPriceToTransferAt,
				defaultCurrency: splDetails.listingDefaultCurrency
			}
		)

		// 3) Record to spl_purchase table:
		await addSplPurchaseRecord(splDetails.splId, splTransferId, solTransferId)

		return res.status(200).json({
			splName: splDetails.splName,
			splPublicKey: splDetails.publicKeyAddress,
			numberOfShares: purchaseSplTokensData.numberOfTokensPurchasing,
			imageUrl: splDetails.imageUrl,
			uuid: splDetails.uuid,
			isMyContent: splDetails.creatorWalletId === solanaWallet.solana_wallet_id
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to complete purchase of Spl token(s)"})
	}
}
