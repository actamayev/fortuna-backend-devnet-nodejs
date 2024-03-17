declare global {
	type EmailOrPhone = "Email" | "Phone"

	type EmailOrPhoneOrUsername = EmailOrPhone | "Username"

	interface JwtPayload {
		userId: number
		newUser: boolean
	}
}

export {}
