import jwt from "jsonwebtoken"

export default function getDecodedId(accessToken: string): number | void {
	try {
		const decoded = jwt.verify(accessToken, process.env.JWT_KEY) as JwtPayload
		return decoded.userId
	} catch (error) {
		console.error(error)
	}
}
