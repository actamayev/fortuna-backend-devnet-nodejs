declare global {
	type EmailOrPhone = "Email" | "Phone"

	type EmailOrPhoneOrUsername = EmailOrPhone | "Username"
}

export {}
