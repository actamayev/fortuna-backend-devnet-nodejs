import { promisify } from "util"
import { randomBytes, createCipheriv, createDecipheriv, scrypt } from "crypto"
import SecretsManager from "./secrets-manager"

const scryptAsync = promisify(scrypt)

export default class Encryptor {
	private secretsManagerInstance: SecretsManager

	constructor() {
		this.secretsManagerInstance = SecretsManager.getInstance()
	}

	public async encrypt(data: string, encryptionKeyName: EncryptionKeys): Promise<EncryptedString> {
		try {
			const iv = randomBytes(16) // Generate a new IV for each encryption
			const salt = randomBytes(16) // Generate a new salt for each encryption
			const encryptionKey = await this.secretsManagerInstance.getSecret(encryptionKeyName)

			const key = (await scryptAsync(encryptionKey, salt, 32)) as Buffer
			const cipher = createCipheriv("aes-256-gcm", key, iv)

			let encrypted = cipher.update(data, "utf8", "hex")
			encrypted += cipher.final("hex")
			const authTag = cipher.getAuthTag().toString("hex")

			return `${iv.toString("hex")}:${salt.toString("hex")}:${encrypted}:${authTag}` as EncryptedString

		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public async decrypt(encryptedData: EncryptedString, encryptionKeyName: EncryptionKeys): Promise<string> {
		try {
			const [ivHex, saltHex, encrypted, authTagHex] = encryptedData.split(":")
			const iv = Buffer.from(ivHex, "hex")
			const salt = Buffer.from(saltHex, "hex")
			const authTag = Buffer.from(authTagHex, "hex")
			const encryptionKey = await this.secretsManagerInstance.getSecret(encryptionKeyName)

			const key = (await scryptAsync(encryptionKey, salt, 32)) as Buffer

			const decipher = createDecipheriv("aes-256-gcm", key, iv)
			decipher.setAuthTag(authTag)

			let decrypted = decipher.update(encrypted, "hex", "utf8")
			decrypted += decipher.final("utf8")
			return decrypted
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public static isEncryptedString(data: string): data is EncryptedString {
		const regex = /^[a-f0-9]{32}:[a-f0-9]{32}:[a-f0-9]+:[a-f0-9]{32}$/i
		return regex.test(data)
	}
}
