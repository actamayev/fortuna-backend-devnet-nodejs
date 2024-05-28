import express from "express"

import primarySplTokenPurchase from "../controllers/exchange/primary-spl-token-purchase"
import purchaseExclusiveContentAccess from "../controllers/exchange/purchase-exclusive-content-access"

import attachExclusiveVideoData from "../middleware/attach/attach-exclusive-video-data"
import jwtVerifyAttachSolanaWallet from "../middleware/jwt/jwt-verify-attach-solana-wallet"
import confirmUserHasEnoughSolToPurchasePrimaryTokens
	from "../middleware/confirmations/exchange/confirm-user-has-enough-sol-to-purchase-tokens"
import confirmEnoughSharesInEscrowToCompletePurchase
	from "../middleware/confirmations/exchange/primary/confirm-enough-shares-in-escrow-to-complete-purchase"
import validateVideoUUIDInParams from "../middleware/request-validation/videos/validate-video-uuid-in-params"
import validatePurchaseSplTokens from "../middleware/request-validation/exchange/validate-purchase-spl-tokens"
import attachSplDetailsByPublicKeyForPrimarySplPurchase from "../middleware/attach/attach-spl-details-by-public-key"
import confirmUserDoesntAlreadyHaveExclusiveAccess
	from "../middleware/confirmations/exchange/instant-exclusive-access/confirm-user-doesnt-already-have-exclusive-access"
import confirmUserHasEnoughSolToPurchaseExclusiveAccess
	from "../middleware/confirmations/exchange/instant-exclusive-access/confirm-user-has-enough-sol-to-purchase-exclusive-access"
import confirmCreatorNotBuyingOwnShares from "../middleware/confirmations/exchange/primary/confirm-creator-not-buying-own-shares"
import confirmCreatorNotBuyingInstantAccessToOwnExclusiveContent
	from "../middleware/confirmations/exchange/instant-exclusive-access/confirm-creator-not-buying-instant-access-to-own-exclusive-content"

const exchangeRoutes = express.Router()

// FUTURE TODO: Add an endpoint that allows for a creator to buy their own shares.
// The creator will pay the Fortuna Wallet for the shares they're buying

exchangeRoutes.post(
	"/primary-spl-token-purchase",
	validatePurchaseSplTokens,
	jwtVerifyAttachSolanaWallet,
	attachSplDetailsByPublicKeyForPrimarySplPurchase,
	confirmCreatorNotBuyingOwnShares,
	confirmEnoughSharesInEscrowToCompletePurchase,
	confirmUserHasEnoughSolToPurchasePrimaryTokens,
	primarySplTokenPurchase
)

exchangeRoutes.post(
	"/purchase-exclusive-content-access/:videoUUID",
	validateVideoUUIDInParams,
	jwtVerifyAttachSolanaWallet,
	attachExclusiveVideoData,
	confirmCreatorNotBuyingInstantAccessToOwnExclusiveContent,
	confirmUserDoesntAlreadyHaveExclusiveAccess,
	confirmUserHasEnoughSolToPurchaseExclusiveAccess,
	purchaseExclusiveContentAccess
)

export default exchangeRoutes
