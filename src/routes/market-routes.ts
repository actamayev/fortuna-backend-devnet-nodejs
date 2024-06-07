import express from "express"

import purchaseInstantExclusiveContentAccess from "../controllers/market/purchase-instant-exclusive-content-access"

import attachExclusiveVideoData from "../middleware/attach/attach-exclusive-video-data"
import jwtVerifyAttachSolanaWallet from "../middleware/jwt/jwt-verify-attach-solana-wallet"
import validatePurchaseInstantAccess from "../middleware/request-validation/videos/validate-puchase-instant-access"
import confirmUserDoesntAlreadyHaveExclusiveAccess
	from "../middleware/confirmations/exchange/instant-exclusive-access/confirm-user-doesnt-already-have-exclusive-access"
import confirmUserHasEnoughSolToPurchaseExclusiveAccess
	from "../middleware/confirmations/exchange/instant-exclusive-access/confirm-user-has-enough-sol-to-purchase-exclusive-access"
import confirmCreatorNotBuyingInstantAccessToOwnExclusiveContent
	from "../middleware/confirmations/exchange/instant-exclusive-access/confirm-creator-not-buying-instant-access-to-own-exclusive-content"

const marketRoutes = express.Router()

//Send back the videoUUID and the tierNumber.
// check if the tier that the user is buying into has a purchase limit.
// if there is a purchase limit, count how many purchases have been made thus far. and if it has been surpassed.
// check if the user has enough sol to purchase.
marketRoutes.post(
	"/purchase-instant-exclusive-content-access",
	validatePurchaseInstantAccess,
	jwtVerifyAttachSolanaWallet,
	attachExclusiveVideoData,
	confirmCreatorNotBuyingInstantAccessToOwnExclusiveContent,
	confirmUserDoesntAlreadyHaveExclusiveAccess,
	confirmUserHasEnoughSolToPurchaseExclusiveAccess,
	purchaseInstantExclusiveContentAccess
)

export default marketRoutes
