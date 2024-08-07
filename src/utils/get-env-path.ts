export default function getEnvPath (): string {
	const env = process.env.NODE_ENV

	if (env === "production-devnet") {
		return ".env.devnet.production"
	}

	if (env === "production-mainnet") {
		return ".env.mainnet.production"
	}

	return ".env.local"
}
