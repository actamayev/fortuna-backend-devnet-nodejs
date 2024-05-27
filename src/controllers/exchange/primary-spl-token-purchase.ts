import _ from "lodash"
import { Request, Response } from "express"
import SolPriceManager from "../../classes/sol-price-manager"
import transferSolFunction from "../../utils/exchange/transfer-sol-function"
import checkIfNewSplPurchaseAllowsAccessToExclusiveContent
	from "../../utils/exclusive-content/check-if-new-spl-purchase-allows-access-to-exclusive-content"
import addSplPurchaseRecord from "../../db-operations/write/spl/spl-purchase/add-spl-purchase-record"
import retrieveCreatorWalletInfoFromSpl from "../../db-operations/read/spl/retrieve-creator-wallet-info-from-spl"
import transferSplTokensToUser from "../../utils/exchange/purchase-primary-spl-tokens/transfer-spl-tokens-to-user"
import updateBidStatusOnWalletBalanceChange from "../../utils/exchange/update-bid-status-on-wallet-balance-change"
import AwsS3 from "../../classes/aws-s3"

// eslint-disable-next-line max-lines-per-function
export default async function primarySplTokenPurchase(req: Request, res: Response): Promise<Response> {
	try {
		const { solanaWallet, splDetails } = req
		const purchaseSplTokensData = req.body.purchaseSplTokensData as PurchasePrimarySPLTokensData
		// FUTURE TODO: See if there's a way to simultaneously transfer Spl tokens to user and transfer sol from user to creator
		// Better for this to be done as one transaction (so that if either one fails, neither go through)

		// 1) Transfer sol from user to creator (fortuna wallet should cover transaction)
		// Record the transaction (save to sol_transfer table)
		const creatorWalletInfo = await retrieveCreatorWalletInfoFromSpl(splDetails.splId)
		if (_.isNull(creatorWalletInfo)) return res.status(500).json({ error: "Unable to find creator's public key" })

		const solPrice = (await SolPriceManager.getInstance().getPrice()).price

		const transferCurrencyAmounts = {
			usdPriceToTransferAt: splDetails.listingSharePriceUsd,
			solPriceToTransferAt: splDetails.listingSharePriceUsd / solPrice
		}

		const solTransferId = await transferSolFunction(
			solanaWallet,
			creatorWalletInfo,
			{
				solToTransfer: purchaseSplTokensData.numberOfTokensPurchasing * transferCurrencyAmounts.solPriceToTransferAt,
				usdToTransfer: purchaseSplTokensData.numberOfTokensPurchasing * transferCurrencyAmounts.usdPriceToTransferAt,
				defaultCurrency: "usd"
			}
		)

		// 2) Transfer spl from escrow to user (fortuna wallet should cover transaction)
		// As part of the transfer to user, may need to create a token account for the user.
		// record the transaction (save to spl_transfer table)

		const splTransferId = await transferSplTokensToUser(solanaWallet, purchaseSplTokensData, splDetails)

		// 3) Record to spl_purchase table:
		await addSplPurchaseRecord(splDetails.splId, splTransferId, solTransferId)

		await updateBidStatusOnWalletBalanceChange(solanaWallet)

		let videoUrl
		const doesUserNeedVideoUrl = await checkIfNewSplPurchaseAllowsAccessToExclusiveContent(
			solanaWallet.solana_wallet_id,
			splDetails,
			purchaseSplTokensData.numberOfTokensPurchasing
		)

		if (doesUserNeedVideoUrl === true) {
			videoUrl = await AwsS3.getInstance().getSignedVideoUrl(splDetails.uuid)
		}

		return res.status(200).json({
			splName: splDetails.splName,
			splPublicKey: splDetails.publicKeyAddress,
			purchaseData: [{
				numberOfShares: purchaseSplTokensData.numberOfTokensPurchasing,
				purchasePricePerShareUsd: splDetails.listingSharePriceUsd
			}],
			imageUrl: splDetails.imageUrl,
			uuid: splDetails.uuid,
			isMyContent: splDetails.creatorWalletId === solanaWallet.solana_wallet_id,
			videoUrl
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to complete purchase of Spl token(s)"})
	}
}
