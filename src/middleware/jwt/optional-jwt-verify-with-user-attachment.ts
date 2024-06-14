import _ from "lodash"
import { Request, Response, NextFunction } from "express"
import getDecodedId from "../../utils/auth-helpers/get-decoded-id"
import { findUserById } from "../../db-operations/read/find/find-user"

export default async function optionalJwtVerifyWithUserAttachment(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<Response | void> {
	try {
		const accessToken = req.headers.authorization as string | undefined

		if (_.isUndefined(accessToken)) {
			next()
			return
		}

		const userId = await getDecodedId(accessToken)

		const user = await findUserById(userId)

		if (_.isNull(user)) return res.status(401).json({ error: "Unauthorized User" })

		req.optionallyAttachedUser = user
		next()
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to attach user to request" })
	}
}
