import { v4 as uuidv4 } from "uuid"

export function createS3Key(folderName: S3FolderNames, uuid: string): string {
	const key = `${folderName}/${uuid}`

	return key
}

export function createS3KeyGenerateUUID(folderName: S3FolderNames): { key: string, uuid: string } {
	const uuid = uuidv4()

	const key = `${folderName}/${uuid}`

	return { key, uuid }
}
