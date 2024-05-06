import prismaClient from "../../../../classes/prisma-client"

export default async function addProfilePictureRecord (
	imageUploadUrl: string,
	fileName: string,
	uuid: string,
	userId: number
): Promise<void> {
	try {
		await prismaClient.$transaction(async (prisma) => {
			const profilePicture = await prisma.profile_picture.create({
				data: {
					image_url: imageUploadUrl,
					file_name: fileName,
					uuid
				}
			})

			await prisma.credentials.update({
				where: {
					user_id: userId
				},
				data: {
					profile_picture_id: profilePicture.profile_picture_id
				}
			})
		})
	} catch (error) {
		console.error(error)
		throw error
	}
}
