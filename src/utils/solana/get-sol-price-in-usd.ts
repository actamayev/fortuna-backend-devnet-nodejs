// TODO: Make a class that holds the price of Sol.
// Then, whenever calling this function, call the sol price in that class.
// Keep track of when the last time the price was retrieved. If it was more than 1 minute ago, call this function again to update the price.
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
