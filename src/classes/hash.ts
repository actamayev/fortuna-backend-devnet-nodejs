import _ from "lodash"
import { hash, compare } from "bcrypt"

export default class Hash {
	public static async hashCredentials(unhashedData: string): Promise<HashedString> {
		const saltRounds = 10
		try {
			const hashedData = await hash(unhashedData, saltRounds) as HashedString
			return hashedData
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public static async hashStringLowercase(unhashedData: string): Promise<HashedString> {
		try {
			return await this.hashCredentials(_.toLower(unhashedData))
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public static async checkPassword(plaintextPassword: string, hashedPassword: HashedString): Promise<boolean> {
		try {
			const isMatch = await compare(plaintextPassword, hashedPassword)
			return isMatch
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public static isHashedString(potentialHash: string): potentialHash is HashedString {
		const bcryptRegex = /^\$2[aby]?\$[\d]{2}\$[./A-Za-z0-9]{53}$/
		return bcryptRegex.test(potentialHash)
	}
}
