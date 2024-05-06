import Joi from "joi"
import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import getDecodedId from "../../utils/auth-helpers/get-decoded-id"
import { findUserById } from "../../utils/db-operations/read/find/find-user"

const authorizationSchema = Joi.object({
	authorization: Joi.string().required()
}).unknown(true)

export default async function jwtVerify(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	try {
		const { error } = authorizationSchema.validate(req.headers)

		if (!_.isUndefined(error)) return handleUnauthorized()

		const accessToken = req.headers.authorization as string

		const userId = await getDecodedId(accessToken)

		const user = await findUserById(userId)

		if (_.isNull(user)) return handleUnauthorized()

		req.user = user
		next()
	} catch (error) {
		console.error(error)
		return handleUnauthorized()
	}

	function handleUnauthorized(): Response {
		return res.status(401).json({ error: "Unauthorized User" })
	}
}
