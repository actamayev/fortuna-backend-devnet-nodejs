import _ from "lodash"
import Singleton from "../singleton"

export default class SolPriceManager extends Singleton {
	private lastPrice: number | null = null
	private lastFetchedTime: Date | null = null
	private readonly fetchInterval: number = 30000 // 30000 miliseconds: 30 seconds

	private constructor() {
		super()
	}

	public static getInstance(): SolPriceManager {
		if (_.isNull(SolPriceManager.instance)) {
			SolPriceManager.instance = new SolPriceManager()
		}
		return SolPriceManager.instance
	}

	public async getPrice(): Promise<{ price: number; fetchedAt: Date }> {
		try {
			const currentTime = new Date()
			// Check if the last fetched time is more than the fetch interval
			if (
				_.isNull(this.lastFetchedTime) ||
				this.lastFetchedTime.getTime() < currentTime.getTime() - this.fetchInterval
			) {
				this.lastPrice = await this.fetchPrice()
				this.lastFetchedTime = currentTime
			}
			return {
				price: this.lastPrice as number,
				fetchedAt: this.lastFetchedTime
			}
		} catch (error) {
			console.error("Error getting Sol Price", error)
			throw error
		}
	}

	private async fetchPrice(): Promise<number> {
		try {
			const url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
			const response = await fetch(url)
			const data = await response.json()
			return data.solana.usd
		} catch (error) {
			console.error("Error fetching SOL price:", error)
			throw error
		}
	}
}
