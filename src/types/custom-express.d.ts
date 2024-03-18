import { Credentials } from "@prisma/client"

declare global {
	namespace Express {
		interface Request {
			user: Credentials
		}
	}
}

export {}
