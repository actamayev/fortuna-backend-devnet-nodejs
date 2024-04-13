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
		is_active: boolean
		email?: string
		phone_number?: string
	}
}

export {}
