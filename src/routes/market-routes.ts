import express from "express"

import purchaseInstantExclusiveContentAccess from "../controllers/market/purchase-instant-exclusive-content-access"

import jwtVerifyAttachSolanaWallet from "../middleware/jwt/jwt-verify-attach-solana-wallet"
import confirmUserDoesntAlreadyHaveExclusiveAccess
	from "../middleware/confirmations/market/confirm-user-doesnt-already-have-exclusive-access"
import confirmTierNotSoldOut from "../middleware/confirmations/market/confirm-tier-not-sold-out"
import confirmUserHasSufficientFundsToPurchaseExclusiveAccess
	from "../middleware/confirmations/market/confirm-user-has-sufficient-funds-to-purchase-exclusive-access"
import confirmCreatorNotBuyingInstantAccessToOwnExclusiveContent
	from "../middleware/confirmations/market/confirm-creator-not-buying-instant-access-to-own-exclusive-content"
import validatePurchaseInstantAccess from "../middleware/request-validation/videos/validate-puchase-instant-access"
import attachExclusiveVideoDataByUUID from "../middleware/attach/exclusive-video-data/attach-exclusive-video-data-by-uuid"

const marketRoutes = express.Router()

marketRoutes.post(
	"/purchase-instant-exclusive-content-access",
	validatePurchaseInstantAccess,
	jwtVerifyAttachSolanaWallet,
	attachExclusiveVideoDataByUUID,
	confirmTierNotSoldOut,
	confirmCreatorNotBuyingInstantAccessToOwnExclusiveContent,
	confirmUserDoesntAlreadyHaveExclusiveAccess,
	confirmUserHasSufficientFundsToPurchaseExclusiveAccess,
	purchaseInstantExclusiveContentAccess
)

export default marketRoutes
