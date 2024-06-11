import { promisify } from "util"
import { randomBytes, createCipheriv, createDecipheriv, scrypt } from "crypto"
import SecretsManager from "./secrets-manager"

const scryptAsync = promisify(scrypt)

export default class Encryptor {
	private secretsManagerInstance: SecretsManager

	constructor() {
		this.secretsManagerInstance = SecretsManager.getInstance()
	}

	public async nonDeterministicEncrypt(
		data: string,
		encryptionKeyName: NonDeterministicEncryptionKeys
	): Promise<NonDeterministicEncryptedString> {
		try {
			const iv = randomBytes(16) // Generate a new IV for each encryption
			const salt = randomBytes(16) // Generate a new salt for each encryption
			const encryptionKey = await this.secretsManagerInstance.getSecret(encryptionKeyName)

			const key = (await scryptAsync(encryptionKey, salt, 32)) as Buffer
			const cipher = createCipheriv("aes-256-gcm", key, iv)

			let encrypted = cipher.update(data, "utf8", "hex")
			encrypted += cipher.final("hex")
			const authTag = cipher.getAuthTag().toString("hex")

			return `${iv.toString("hex")}:${salt.toString("hex")}:${encrypted}:${authTag}` as NonDeterministicEncryptedString
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public async nonDeterministicDecrypt(
		encryptedData: NonDeterministicEncryptedString,
		encryptionKeyName: NonDeterministicEncryptionKeys
	): Promise<string> {
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

	public static isNonDeterminsticEncryptedString(data: string): data is NonDeterministicEncryptedString {
		try {
			const regex = /^[a-f0-9]{32}:[a-f0-9]{32}:[a-f0-9]+:[a-f0-9]{32}$/i
			return regex.test(data)
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public async deterministicEncrypt(data: string, encryptionKeyName: DeterministicEncryptionKeys): Promise<DeterministicEncryptedString> {
		try {

			const iv = Buffer.alloc(16, 0) // Fixed IV (not recommended for production)
			const encryptionKey = await this.secretsManagerInstance.getSecret(encryptionKeyName)

			const cipher = createCipheriv("aes-256-cbc", Buffer.from(encryptionKey, "base64"), iv)
			let encrypted = cipher.update(data, "utf8", "base64")
			encrypted += cipher.final("base64")
			return encrypted as DeterministicEncryptedString
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public async deterministicDecrypt(
		encrypted: DeterministicEncryptedString,
		encryptionKeyName: DeterministicEncryptionKeys
	): Promise<string> {
		try {
			const iv = Buffer.alloc(16, 0) // Fixed IV (not recommended for production)
			const encryptionKey = await this.secretsManagerInstance.getSecret(encryptionKeyName)

			const decipher = createDecipheriv("aes-256-cbc", Buffer.from(encryptionKey, "base64"), iv)
			let decrypted = decipher.update(encrypted, "base64", "utf8")
			decrypted += decipher.final("utf8")
			return decrypted
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public static isDeterministicEncryptedString(data: string): data is DeterministicEncryptedString {
		try {
		// Check if the data is a valid Base64 string
		// Base64 regex pattern: ^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$
		// eslint-disable-next-line security/detect-unsafe-regex, no-useless-escape
			const regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/
			return regex.test(data)
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
