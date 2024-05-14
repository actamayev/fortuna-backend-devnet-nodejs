import PrismaClientClass from "../../../classes/prisma-client"

export default async function checkIfSplExistsById(splId: number): Promise<boolean> {
	try {
		const prismaClient = await PrismaClientClass.getPrismaClient()
		const spl = await prismaClient.spl.findFirst({
			where: {
				spl_id: splId
			}
		})

		return spl !== null
	} catch (error) {
		console.error(error)
		throw error
	}
}
