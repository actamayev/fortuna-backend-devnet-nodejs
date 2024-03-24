export default async function getSolPriceInUSD(): Promise<number | null> {
	const url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"

	try {
		const response = await fetch(url)
		const data = await response.json()
		const solPriceInUSD = data.solana.usd
		return solPriceInUSD
	} catch (error) {
		console.error("Error fetching SOL price:", error)
		return null
	}
}
