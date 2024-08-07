import { clusterApiUrl } from "@solana/web3.js"

export function getClusterUrlByEnv(): string {
	const env = process.env.NODE_ENV

	if (env === "production-mainnet") {
		return clusterApiUrl("mainnet-beta")
	}

	return clusterApiUrl("devnet")
}
