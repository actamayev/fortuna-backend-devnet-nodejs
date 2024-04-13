import jwt from "jsonwebtoken"

export default function signJWT(payload: JwtPayload): string {
	try {
		return jwt.sign(payload, process.env.JWT_KEY)
	} catch (error) {
		console.error(error)
		throw error
	}
}
