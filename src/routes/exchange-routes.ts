import express from "express"

import cancelSplAsk from "../controllers/exchange/ask/cancel-spl-ask"
import cancelSplBid from "../controllers/exchange/bid/cancel-spl-bid"
import retrieveUserOrders from "../controllers/exchange/retrieve-user-orders"
import primarySplTokenPurchase from "../controllers/exchange/primary-spl-token-purchase"
import retrieveOpenOrdersBySplId from "../controllers/exchange/retrieve-open-orders-by-spl-id"
import placeSecondaryMarketSplAsk from "../controllers/exchange/ask/place-secondary-market-spl-ask"
import placeSecondaryMarketSplBid from "../controllers/exchange/bid/place-secondary-market-spl-bid"

import {
	attachSplDetailsByPublicKeyForPrimarySplPurchase,
	attachSplDetailsByPublicKeyForSecondarySplBid,
	attachSplDetailsByPublicKeyForSecondarySplAsk
} from "../middleware/attach/attach-spl-details-by-public-key"
import confirmBidCreator from "../middleware/confirmations/exchange/confirm-bid-creator"
import confirmAskCreator from "../middleware/confirmations/exchange/confirm-ask-creator"
import {
	confirmUserHasEnoughSolToBidForSecondaryTokens,
	confirmUserHasEnoughSolToPurchasePrimaryTokens
} from "../middleware/confirmations/exchange/confirm-user-has-enough-sol-to-purchase-tokens"
import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"
import confirmSplExistsById from "../middleware/confirmations/exchange/confirm-spl-exists-by-id"
import validateCancelSplBid from "../middleware/request-validation/exchange/bid/validate-cancel-bid"
import validateCancelSplAsk from "../middleware/request-validation/exchange/ask/validate-cancel-ask"
import confirmEnoughSharesInEscrowToCompletePurchase
	from "../middleware/confirmations/exchange/confirm-enough-shares-in-escrow-to-complete-purchase"
import validateSplIdInParams from "../middleware/request-validation/exchange/validate-spl-id-in-params"
import validateCreateSplBid from "../middleware/request-validation/exchange/bid/validate-create-spl-bid"
import validateCreateSplAsk from "../middleware/request-validation/exchange/ask/validate-create-spl-ask"
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

exchangeRoutes.post(
	"/cancel-spl-bid/:splBidId",
	validateCancelSplBid,
	confirmBidCreator,
	cancelSplBid
)

exchangeRoutes.post(
	"/cancel-spl-ask/:splAskId",
	validateCancelSplAsk,
	confirmAskCreator,
	cancelSplAsk
)

exchangeRoutes.get("/retrieve-my-orders", retrieveUserOrders)

exchangeRoutes.get(
	"/retrieve-open-orders-by-spl-id/:splId",
	validateSplIdInParams,
	confirmSplExistsById,
	retrieveOpenOrdersBySplId
)

// FUTURE TODO: Add routes to edit an order.
export default exchangeRoutes
