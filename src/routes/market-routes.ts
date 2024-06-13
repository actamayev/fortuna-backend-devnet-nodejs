import express from "express"

import purchaseInstantExclusiveContentAccess from "../controllers/market/purchase-instant-exclusive-content-access"

import attachExclusiveVideoData from "../middleware/attach/attach-exclusive-video-data"
import jwtVerifyAttachSolanaWallet from "../middleware/jwt/jwt-verify-attach-solana-wallet"
import confirmUserDoesntAlreadyHaveExclusiveAccess
	from "../middleware/confirmations/market/confirm-user-doesnt-already-have-exclusive-access"
import confirmTierNotSoldOut from "../middleware/confirmations/market/confirm-tier-not-sold-out"
import confirmUserHasSufficientFundsToPurchaseExclusiveAccess
	from "../middleware/confirmations/market/confirm-user-has-sufficient-funds-to-purchase-exclusive-access"
import confirmCreatorNotBuyingInstantAccessToOwnExclusiveContent
	from "../middleware/confirmations/market/confirm-creator-not-buying-instant-access-to-own-exclusive-content"
import validatePurchaseInstantAccess from "../middleware/request-validation/videos/validate-puchase-instant-access"

const marketRoutes = express.Router()

marketRoutes.post(
	"/purchase-instant-exclusive-content-access",
	validatePurchaseInstantAccess,
	jwtVerifyAttachSolanaWallet,
	attachExclusiveVideoData,
	confirmTierNotSoldOut,
	confirmCreatorNotBuyingInstantAccessToOwnExclusiveContent,
	confirmUserDoesntAlreadyHaveExclusiveAccess,
	confirmUserHasSufficientFundsToPurchaseExclusiveAccess,
	purchaseInstantExclusiveContentAccess
)

export default marketRoutes
