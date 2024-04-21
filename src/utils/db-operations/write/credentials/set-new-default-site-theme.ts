import { SiteThemes } from "@prisma/client"
import prismaClient from "../../../../prisma-client"

export default async function setNewDefaultSiteTheme(userId: number, defaultSiteTheme: SiteThemes): Promise<void> {
	try {
		await prismaClient.credentials.update({
			where: {
				user_id: userId
			},
			data: {
				default_site_theme: defaultSiteTheme
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
