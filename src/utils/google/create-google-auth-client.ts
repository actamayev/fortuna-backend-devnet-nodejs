import { OAuth2Client } from "google-auth-library"
import SecretsManager from "../../classes/secrets-manager"

export default async function createGoogleAuthClient(): Promise<OAuth2Client> {
	const googleClientId = await SecretsManager.getInstance().getSecret("GOOGLE_CLIENT_ID")
	const googleClientSecret = await SecretsManager.getInstance().getSecret("GOOGLE_CLIENT_SECRET")

	return new OAuth2Client(
		googleClientId,
		googleClientSecret,
		"postmessage"
	)
}
