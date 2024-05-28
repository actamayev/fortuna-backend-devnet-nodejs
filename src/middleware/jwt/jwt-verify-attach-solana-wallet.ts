import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import getDecodedId from "../../utils/auth-helpers/get-decoded-id"
import { findSolanaWalletByUserId } from "../../db-operations/read/find/find-solana-wallet"

const authorizationSchema = Joi.object({
	authorization: Joi.string().required()
}).unknown(true)

export default async function jwtVerifyAttachSolanaWallet(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { error } = authorizationSchema.validate(req.headers)

		if (!_.isUndefined(error)) return handleUnauthorized()

		const accessToken = req.headers.authorization as string

		const userId = await getDecodedId(accessToken)

		const solanaWallet = await findSolanaWalletByUserId(userId)

		if (_.isNull(solanaWallet)) return handleUnauthorized()

		req.solanaWallet = solanaWallet
		next()
	} catch (error) {
		console.error(error)
		return handleUnauthorized()
	}

	function handleUnauthorized(): Response {
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
