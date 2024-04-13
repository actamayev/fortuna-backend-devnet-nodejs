import _ from "lodash"

export default class SolPriceManager {
	private static instance: SolPriceManager | null = null
	private lastPrice: number | null = null
	private lastFetchedTime: number = 0

	private constructor() {
	}

	public static getInstance(): SolPriceManager {
		if (_.isNull(SolPriceManager.instance)) {
			SolPriceManager.instance = new SolPriceManager()
		}
		return SolPriceManager.instance
	}

	private async fetchPrice(): Promise<number | null> {
		const url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
		try {
			const response = await fetch(url)
			const data = await response.json()
			console.log(data)
			return data.solana.usd
		} catch (error) {
			console.error("Error fetching SOL price:", error)
			return null
		}
	}

	// TODO: Check the coin gecko api. how often am i allowed to request the price?
	public async getPrice(): Promise<number | null> {
		const currentTime = Date.now()
		// Check if the last fetched time is more than 1 minute ago
		if (this.lastFetchedTime < currentTime - 60000 || this.lastPrice === null) {
			this.lastPrice = await this.fetchPrice()
			this.lastFetchedTime = currentTime
		}
		return this.lastPrice
	}
}
