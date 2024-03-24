import { v4 as uuidv4 } from "uuid"

export function createS3Key(
	folderName: S3FolderNames,
	fileName: string,
	uuid: string
): string {
	const uniqueFileName = `${uuid}-${fileName}`
	const key = `${folderName}/${uniqueFileName}`

	return key
}

export function createS3KeyGenerateUUID(
	folderName: S3FolderNames,
	fileName: string,
): { key: string, uuid: string } {
	const uuid = uuidv4()

	const uniqueFileName = `${uuid}-${fileName}`
	const key = `${folderName}/${uniqueFileName}`

	return { key, uuid }
}

