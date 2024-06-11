import { v4 as uuidv4 } from "uuid"

export function createS3Key(folderName: S3FolderNames, uuid: string): string {
	try {
		const key = `${folderName}/${uuid}`

		return key
	} catch (error) {
		console.error(error)
		throw error
	}
}

export function createS3KeyGenerateUUID(folderName: S3FolderNames): { key: string, uuid: string } {
	try {
		const uuid = uuidv4()

		const key = `${folderName}/${uuid}`

		return { key, uuid }
	} catch (error) {
		console.error(error)
		throw error
	}
}
