import _ from "lodash"
import dotenv from "dotenv"
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager"

// TODO: Make a method that takes in an array of strings, and returns the values of the secrets keys for each of them
// This can reduce the number of lines of code in files that use multiple environment variables.
export default class SecretsManager {
	private static instance: SecretsManager | null = null
	private secrets: Map<string, string> = new Map()
	private secretsManager?: SecretsManagerClient

	constructor() {
		if (process.env.NODE_ENV === "production") {
			this.secretsManager = new SecretsManagerClient({
				credentials: {
					accessKeyId: process.env.AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				},

				region: process.env.AWS_REGION,
			})
		} else {
			dotenv.config({ path: ".env.local" })
		}
	}

	public static getInstance(): SecretsManager {
		if (_.isNull(SecretsManager.instance)) {
			SecretsManager.instance = new SecretsManager()
		}
		return SecretsManager.instance
	}

	public async getSecret(key: SecretKeys): Promise<string> {
		try {
			let secret: string | undefined
			if (this.secrets.has(key)) {
				secret = this.secrets.get(key)
			} else if (process.env.NODE_ENV === "production") {
				secret = await this.fetchSecretFromAWS(key)
			} else {
				secret = process.env[key]
			}
			if (_.isUndefined(secret)) throw Error("Unable to retrieve secret")
			return secret
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public async fetchSecretFromAWS(key: string): Promise<string> {
		const command = new GetSecretValueCommand({
			SecretId: "new_devnet_secrets"
		})

		if (_.isUndefined(this.secretsManager)) {
			throw new Error("Secrets Manager client is not initialized!")
		}

		try {
			const response = await this.secretsManager.send(command)

			if (_.isUndefined(response.SecretString)) {
				throw new Error("SecretString is undefined!")
			} else {
				this.updateSecretsMap(response.SecretString)
			}

			const secretValue = this.secrets.get(key)
			if (_.isUndefined(secretValue)) {
				throw new Error(`Secret value for key ${key} is undefined!`)
			}
			return secretValue
		} catch (error) {
			console.error("Error retrieving secret from AWS:", error)
			throw error
		}
	}

	private updateSecretsMap(secretsString: string): void {
		const secrets = JSON.parse(secretsString)
		Object.keys(secrets).forEach(key => {
			const value = secrets[key]
			if (!_.isUndefined(value)) {
				this.secrets.set(key, value)
			} else {
				console.error(`Value for key ${key} is undefined.`)
			}
		})
	}
}
