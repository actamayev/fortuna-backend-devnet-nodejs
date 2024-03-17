import signJWT from "./sign-jwt"

export default function createAndSignJWT(userId: number, isNewUser: boolean = false): string | undefined {
	const token = signJWT({ userId, isNewUser })
	return token
}
