import { hash, compare } from "bcrypt"
import SecretsManager from "./secrets-manager"

export default class Hash {
	public static async hashCredentials(unhashedData: string): Promise<string> {
		const saltRounds = await SecretsManager.getInstance().getSecret("SALT_ROUNDS")
		try {
			const hashedData = await hash(unhashedData, parseInt(saltRounds, 10) || 10)
			return hashedData
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public static async checkPassword(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
		try {
			const isMatch = await compare(plaintextPassword, hashedPassword)
			return isMatch
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
