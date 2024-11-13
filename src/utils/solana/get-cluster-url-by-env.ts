import { clusterApiUrl } from "@solana/web3.js"

export function getClusterUrlByEnv(): string {
	const env = process.env.NODE_ENV

	if (env === "production") {
		return "https://sleek-sparkling-waterfall.solana-mainnet.quiknode.pro/2304791a7554e508e4d429ba1adb4f91d5a9c7c5"
	}

	return clusterApiUrl("devnet")
}
