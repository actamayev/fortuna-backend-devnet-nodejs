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

	private async fetchPrice(): Promise<number> {
		const url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
		try {
			const response = await fetch(url)
			const data = await response.json()
			return data.solana.usd
		} catch (error) {
			console.error("Error fetching SOL price:", error)
			throw error
		}
	}

	public async getPrice(): Promise<number> {
		try {
			const currentTime = Date.now()
			// Check if the last fetched time is more than 30 seconds ago
			if (this.lastFetchedTime < currentTime - 30000 || this.lastPrice === null) {
				this.lastPrice = await this.fetchPrice()
				this.lastFetchedTime = currentTime
			}
			return this.lastPrice
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
