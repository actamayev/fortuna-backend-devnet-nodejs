import express from "express"

import primarySplTokenPurchase from "../controllers/exchange/primary-spl-token-purchase"
import placeSecondaryMarketSplAsk from "../controllers/exchange/place-secondary-market-spl-ask"
import placeSecondaryMarketSplBid from "../controllers/exchange/place-secondary-market-spl-bid"

import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"
import {
	attachSplDetailsByPublicKeyForPrimarySplPurchase,
	attachSplDetailsByPublicKeyForSecondarySplBid,
	attachSplDetailsByPublicKeyForSecondarySplAsk
} from "../middleware/attach/attach-spl-details-by-public-key"
import {
	confirmUserHasEnoughSolToBidForSecondaryTokens,
	confirmUserHasEnoughSolToPurchasePrimaryTokens
} from "../middleware/confirmations/exchange/confirm-user-has-enough-sol-to-purchase-tokens"
import confirmEnoughSharesInEscrowToCompletePurchase
	from "../middleware/confirmations/exchange/confirm-enough-shares-in-escrow-to-complete-purchase"
import validateCreateSplBid from "../middleware/request-validation/exchange/validate-create-spl-bid"
import validateCreateSplAsk from "../middleware/request-validation/exchange/validate-create-spl-ask"
import validatePurchaseSplTokens from "../middleware/request-validation/exchange/validate-purchase-spl-tokens"
import confirmCreatorNotBuyingOwnShares from "../middleware/confirmations/exchange/confirm-creator-not-buying-own-shares"
import confirmUserHasEnoughTokensToCreateSplAsk from "../middleware/confirmations/exchange/confirm-user-has-enough-tokens-to-create-spl-ask"

const exchangeRoutes = express.Router()

// FUTURE TODO: Add an endpoint that allows for a creator to buy their own shares.
// The creator will pay the Fortuna Wallet for the shares they're buying

exchangeRoutes.post(
	"/primary-spl-token-purchase",
	validatePurchaseSplTokens,
	attachSplDetailsByPublicKeyForPrimarySplPurchase,
	confirmEnoughSharesInEscrowToCompletePurchase,
	attachSolanaWalletByUserId,
	confirmCreatorNotBuyingOwnShares,
	confirmUserHasEnoughSolToPurchasePrimaryTokens,
	primarySplTokenPurchase
)

exchangeRoutes.post(
	"/create-spl-bid",
	validateCreateSplBid,
	attachSolanaWalletByUserId,
	attachSplDetailsByPublicKeyForSecondarySplBid,
	confirmUserHasEnoughSolToBidForSecondaryTokens,
	placeSecondaryMarketSplBid
)

exchangeRoutes.post(
	"/create-spl-ask",
	validateCreateSplAsk,
	attachSolanaWalletByUserId,
	attachSplDetailsByPublicKeyForSecondarySplAsk,
	confirmUserHasEnoughTokensToCreateSplAsk,
	placeSecondaryMarketSplAsk
)

// FUTURE TODO: Add routes to cancel an order
// FUTURE TODO: Add routes to edit an order.
export default exchangeRoutes
