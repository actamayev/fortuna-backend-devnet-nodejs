import { Request, Response } from "express"

export default function retrievePersonalInfo(req: Request, res: Response): Response {
	try {
		const user = req.user

		return res.status(200).json({
			username: user.username,
			email: user.email,
			phoneNumber: user.phone_number,
			defaultCurrency: user.default_currency,
			defaultSiteTheme: user.default_site_theme
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to retrieve personal info" })
	}
}
