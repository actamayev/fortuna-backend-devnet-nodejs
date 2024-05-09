import { Request, Response, NextFunction } from "express"
import EscrowWalletManager from "../../../classes/escrow-wallet-manager"

export default async function confirmEnoughSharesInEscrowToCompletePurchase(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const { splDetails } = req

		if (splDetails.splListingStatus === "SOLDOUT") {
			return res.status(400).json({ message: "No more shares available for purchase" })
		}
		const numberOfTokensRemainingInEscrow = await EscrowWalletManager.getInstance().retrieveTokenAmountByPublicKey(
			splDetails.publicKeyAddress
		)

		const purchaseSplTokensData = req.body.purchaseSplTokensData as PurchasePrimarySPLTokensData
		if (numberOfTokensRemainingInEscrow < purchaseSplTokensData.numberOfTokensPurchasing) {
			return res.status(400).json({
				// eslint-disable-next-line max-len
				message: `Attempting to purchase more shares than are available. There are only ${numberOfTokensRemainingInEscrow} shares available`
			})
		}
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to confirm that there are enough shares to purchase" })
	}
}
