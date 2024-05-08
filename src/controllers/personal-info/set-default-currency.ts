import { Request, Response } from "express"
import { Currencies } from "@prisma/client"
import setNewDefaultCurrency from "../../db-operations/write/credentials/set-new-default-currency"

export default async function setDefaultCurrency(req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const defaultCurrency = req.params.defaultCurrency as Currencies
		await setNewDefaultCurrency(user.user_id, defaultCurrency)

		return res.status(200).json({ success: `Set new default currency to ${defaultCurrency}` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to set new default currency" })
	}
}
