import express from "express"

import setDefaultCurrency from "../controllers/personal-info/set-default-currency"
import setDefaultSiteTheme from "../controllers/personal-info/set-default-site-theme"
import retrievePersonalInfo from "../controllers/personal-info/retrieve-personal-info"

import jwtVerifyAttachUser from "../middleware/jwt/jwt-verify-attach-user"
import attachSolanaWalletByUserId from "../middleware/attach/attach-solana-wallet-by-user-id"
import validateSetDefaultCurrency from "../middleware/request-validation/personal-info/validate-set-default-currency"
import validateSetDefaultSiteTheme from "../middleware/request-validation/personal-info/validate-set-default-site-theme"

const personalInfoRoutes = express.Router()

personalInfoRoutes.get(
	"/retrieve-personal-info",
	jwtVerifyAttachUser,
	attachSolanaWalletByUserId,
	retrievePersonalInfo
)

personalInfoRoutes.post(
	"/set-default-currency/:defaultCurrency",
	validateSetDefaultCurrency,
	jwtVerifyAttachUser,
	setDefaultCurrency
)

personalInfoRoutes.post(
	"/set-default-site-theme/:defaultSiteTheme",
	validateSetDefaultSiteTheme,
	jwtVerifyAttachUser,
	setDefaultSiteTheme
)

export default personalInfoRoutes
