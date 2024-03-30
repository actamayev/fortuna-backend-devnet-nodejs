declare global {
	interface LoginInformation {
		contact: string
		password: string
	}

	interface RegisterInformation {
		contact: string
		username: string
		password: string
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
