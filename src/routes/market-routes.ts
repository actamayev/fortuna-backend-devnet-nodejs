import express from "express"

import purchaseInstantExclusiveContentAccess from "../controllers/market/purchase-instant-exclusive-content-access"

import attachExclusiveVideoData from "../middleware/attach/attach-exclusive-video-data"
import jwtVerifyAttachSolanaWallet from "../middleware/jwt/jwt-verify-attach-solana-wallet"
import validateVideoUUIDInParams from "../middleware/request-validation/videos/validate-video-uuid-in-params"
import confirmUserDoesntAlreadyHaveExclusiveAccess
	from "../middleware/confirmations/exchange/instant-exclusive-access/confirm-user-doesnt-already-have-exclusive-access"
import confirmUserHasEnoughSolToPurchaseExclusiveAccess
	from "../middleware/confirmations/exchange/instant-exclusive-access/confirm-user-has-enough-sol-to-purchase-exclusive-access"
import confirmCreatorNotBuyingInstantAccessToOwnExclusiveContent
	from "../middleware/confirmations/exchange/instant-exclusive-access/confirm-creator-not-buying-instant-access-to-own-exclusive-content"

const marketRoutes = express.Router()

marketRoutes.post(
	"/purchase-instant-exclusive-content-access/:videoUUID",
	validateVideoUUIDInParams,
	jwtVerifyAttachSolanaWallet,
	attachExclusiveVideoData,
	confirmCreatorNotBuyingInstantAccessToOwnExclusiveContent,
	confirmUserDoesntAlreadyHaveExclusiveAccess,
	confirmUserHasEnoughSolToPurchaseExclusiveAccess,
	purchaseInstantExclusiveContentAccess
)

export default marketRoutes
