import { AuthMethods } from "@prisma/client"

declare global {
	interface LoginInformation {
		contact: string
		password: string
	}

	interface RegisterInformation extends LoginInformation {
		username: string
	}

	interface NewLocalUserFields {
		username: string
		password: string
		auth_method: AuthMethods
		email?: string
		phone_number?: string
	}
}

export {}
