import _ from "lodash"
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"

export default class EscrowWalletManager {
	private static instance: EscrowWalletManager | null = null
	private tokenAccountMap: Map<string, number> = new Map()
	private lastFetchedTime: number = 0 // Last time the Escrow data was fetched from Blockchain

	private constructor() {
	}

	public static getInstance(): EscrowWalletManager {
		if (_.isNull(EscrowWalletManager.instance)) {
			EscrowWalletManager.instance = new EscrowWalletManager()
		}
		return EscrowWalletManager.instance
	}

	get doesTokenAccountMapNeedRefresh(): boolean {
		const currentTime = Date.now()
		return this.lastFetchedTime < currentTime - 60000 // 1 minute
	}

	private getTokenAmountByPublicKey(publicKey: string): number | undefined {
		return this.tokenAccountMap.get(publicKey)
	}

	private async refreshTokenAccountMap(): Promise<void> {
		try {
			const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
			const tokenAccounts = await connection.getTokenAccountsByOwner(
				new PublicKey(process.env.FORTUNA_ESCROW_WALLET_PUBLIC_KEY),
				{ programId: TOKEN_PROGRAM_ID }
			)

			tokenAccounts.value.forEach(tokenAccount => {
				const accountData = AccountLayout.decode(tokenAccount.account.data)
				const publicKey = new PublicKey(accountData.mint).toString()
				const amount = Number(accountData.amount.toString())
				this.tokenAccountMap.set(publicKey, amount)
			})

			this.lastFetchedTime = Date.now()
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public async retrieveTokenAmountByPublicKey(publicKey: string): Promise<number> {
		try {
			if (
				this.doesTokenAccountMapNeedRefresh ||
				_.isUndefined(this.getTokenAmountByPublicKey(publicKey))
			) {
				await this.refreshTokenAccountMap()
			}
			return this.getTokenAmountByPublicKey(publicKey) || 0
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public async retrieveTokenAmountsByPublicKeys(publicKeys: string[]): Promise<{ [key: string]: number }> {
		try {
			let needsRefresh = this.doesTokenAccountMapNeedRefresh

			const result: { [key: string]: number } = {}

			for (const publicKey of publicKeys) {
				const amount = this.getTokenAmountByPublicKey(publicKey)
				if (_.isUndefined(amount)) {
					needsRefresh = true
					break
				}
				result[publicKey] = amount
			}

			if (needsRefresh === true) {
				await this.refreshTokenAccountMap()
				publicKeys.forEach(publicKey => {
					result[publicKey] = this.getTokenAmountByPublicKey(publicKey) || 0
				})
			}

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public async decrementTokenAmount(publicKey: string, decrementAmount: number): Promise<void> {
		try {
			let currentAmount = this.tokenAccountMap.get(publicKey)
			if (_.isUndefined(currentAmount)) {
				await this.refreshTokenAccountMap()
				currentAmount = this.tokenAccountMap.get(publicKey)
				if (_.isUndefined(currentAmount)) {
					throw Error("Unable to find Token account")
				}
			}
			const newAmount = Math.max(0, currentAmount - decrementAmount)
			this.tokenAccountMap.set(publicKey, newAmount)
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public addSplToMap(publicKey: string, numberShares: number): void {
		try {
			const currentAmount = this.tokenAccountMap.get(publicKey)
			if (!_.isUndefined(currentAmount)) throw Error("Public Key already exists in map")
			this.tokenAccountMap.set(publicKey, numberShares)
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
