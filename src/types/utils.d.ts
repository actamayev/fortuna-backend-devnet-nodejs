declare global {
	type EmailOrPhone = "Email" | "Phone"

	type EmailOrPhoneOrUsername = EmailOrPhone | "Username"

	interface JwtPayload {
		userId: number
		newUser: boolean
	}

	type S3FolderNames =
		"uploaded-images" |
		"uploaded-videos" |
		"spl-metadata"
}

export {}
