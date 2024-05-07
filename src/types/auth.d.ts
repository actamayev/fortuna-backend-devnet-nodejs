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
		email__hashed?: HashedString
		email__encrypted?: EncryptedString
		phone_number__hashed?: HashedString
		phone_number__encrypted?: EncryptedString
	}

	type EncryptedString = string & { __encrypted: true }
	type HashedString = string & { __hashed: true }
}

export {}
