import { SPLListingStatus } from "@prisma/client"
import PrismaClientClass from "../../../classes/prisma-client"

export default async function updateSplListingStatus(splId: number, splListingStatus: SPLListingStatus): Promise<void> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		await prismaClient.spl.update({
			where: {
				spl_id: splId
			},
			data: {
				spl_listing_status: splListingStatus
			}
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
