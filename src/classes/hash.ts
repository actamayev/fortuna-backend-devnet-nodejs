import { hash, compare } from "bcrypt"

export default class Hash {
	public static async hashCredentials(unhashedData: string): Promise<string> {
		const saltRounds = 10
		try {
			const hashedData = await hash(unhashedData, saltRounds)
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
