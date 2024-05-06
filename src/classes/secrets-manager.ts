import _ from "lodash"
import dotenv from "dotenv"
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager"

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

	public async getSecret(key: SecretKeys): Promise<string | undefined> {
		if (_.has(this.secrets, key)) {
			return this.secrets.get(key)
		} else if (process.env.NODE_ENV === "production") {
			return await this.fetchSecretFromAWS(key)
		} else {
			return process.env[key]
		}
	}

	private async fetchSecretFromAWS(key: SecretKeys): Promise<string | undefined> {
		const input = { SecretId: key }
		const command = new GetSecretValueCommand(input)

		if (_.isUndefined(this.secretsManager)) {
			console.error("Secrets Manager client is not initialized.")
			return undefined
		}

		try {
			const response = await this.secretsManager.send(command)
			let secretValue: string | undefined

			if (response.SecretString) {
				const secret = JSON.parse(response.SecretString)
				secretValue = secret[key]
				if (_.isUndefined(secretValue)) return undefined
				this.secrets.set(key, secretValue)
			} else if (response.SecretBinary) {
				// Correctly handle SecretBinary which is a Uint8Array
				const buff = Buffer.from(response.SecretBinary)
				const secret = JSON.parse(buff.toString("utf8"))
				secretValue = secret[key]
				if (_.isUndefined(secretValue)) return undefined
				this.secrets.set(key, secretValue)
			}

			console.log(`Secret retrieved: ${key} - Version: ${response.VersionId} in stages: ${response.VersionStages?.join(", ")}`)
			return secretValue
		} catch (err) {
			console.error("Error retrieving secret from AWS:", err)
			return undefined
		}
	}
}
