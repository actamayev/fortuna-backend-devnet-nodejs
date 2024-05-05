import { Request, Response } from "express"
import { SiteThemes } from "@prisma/client"
import setNewDefaultSiteTheme from "../../utils/db-operations/write/credentials/set-new-default-site-theme"

export default async function setDefaultSiteTheme(req: Request, res: Response): Promise<Response> {
	try {
		const { user } = req
		const defaultSiteTheme = req.params.defaultSiteTheme as SiteThemes
		await setNewDefaultSiteTheme(user.user_id, defaultSiteTheme)

		return res.status(200).json({ success: `Set new default site theme to ${defaultSiteTheme}` })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to set new default site theme" })
	}
}
