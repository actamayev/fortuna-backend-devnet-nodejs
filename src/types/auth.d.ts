declare global {
	interface LoginInformation {
		contact: string
		password: string
	}

	interface RegisterInformation {
		contact: string
		username: string
		password: string
		userType: UserTypes
	}

	interface NewLocalUserFields {
		username: string
		password: string
		is_active: boolean
		email?: string
		phone_number?: string
		user_type: UserTypes
	}
}

export {}
