import express from "express"

import placeSplAsk from "../controllers/exchange/ask/place-spl-ask"
import placeSplBid from "../controllers/exchange/bid/place-spl-bid"
import cancelSplAsk from "../controllers/exchange/ask/cancel-spl-ask"
import cancelSplBid from "../controllers/exchange/bid/cancel-spl-bid"
import retrieveUserOrders from "../controllers/exchange/retrieve-user-orders"
import primarySplTokenPurchase from "../controllers/exchange/primary-spl-token-purchase"
import retrieveOpenOrdersBySplId from "../controllers/exchange/retrieve-open-orders-by-spl-id"

import {
	attachSplDetailsByPublicKeyForSecondarySplBid,
	attachSplDetailsByPublicKeyForSecondarySplAsk,
	attachSplDetailsByPublicKeyForPrimarySplPurchase
} from "../middleware/attach/attach-spl-details-by-public-key"
import confirmBidCreator from "../middleware/confirmations/exchange/bid/confirm-bid-creator"
import confirmAskCreator from "../middleware/confirmations/exchange/ask/confirm-ask-creator"
import {
	confirmUserHasEnoughSolToBidForSecondaryTokens,
	confirmUserHasEnoughSolToPurchasePrimaryTokens
} from "../middleware/confirmations/exchange/confirm-user-has-enough-sol-to-purchase-tokens"
import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"
import confirmSplExistsById from "../middleware/confirmations/exchange/confirm-spl-exists-by-id"
import validateCancelSplBid from "../middleware/request-validation/exchange/bid/validate-cancel-bid"
import validateCancelSplAsk from "../middleware/request-validation/exchange/ask/validate-cancel-ask"
import confirmUserHasEnoughTokensToCreateSplAsk
	from "../middleware/confirmations/exchange/ask/confirm-user-has-enough-tokens-to-create-spl-ask"
import validateSplIdInParams from "../middleware/request-validation/exchange/validate-spl-id-in-params"
import validateCreateSplBid from "../middleware/request-validation/exchange/bid/validate-create-spl-bid"
import validateCreateSplAsk from "../middleware/request-validation/exchange/ask/validate-create-spl-ask"
import confirmEnoughSharesInEscrowToCompletePurchase
	from "../middleware/confirmations/exchange/primary/confirm-enough-shares-in-escrow-to-complete-purchase"
import validatePurchaseSplTokens from "../middleware/request-validation/exchange/validate-purchase-spl-tokens"
import confirmPrimarySplSharesSoldOut from "../middleware/confirmations/exchange/confirm-primary-spl-shares-sold-out"
import confirmCreatorNotBuyingOwnShares from "../middleware/confirmations/exchange/primary/confirm-creator-not-buying-own-shares"

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
	attachSplDetailsByPublicKeyForSecondarySplBid,
	confirmPrimarySplSharesSoldOut,
	attachSolanaWalletByUserId,
	confirmUserHasEnoughSolToBidForSecondaryTokens,
	placeSplBid
)

exchangeRoutes.post(
	"/create-spl-ask",
	validateCreateSplAsk,
	attachSplDetailsByPublicKeyForSecondarySplAsk,
	confirmPrimarySplSharesSoldOut,
	attachSolanaWalletByUserId,
	confirmUserHasEnoughTokensToCreateSplAsk,
	placeSplAsk
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
