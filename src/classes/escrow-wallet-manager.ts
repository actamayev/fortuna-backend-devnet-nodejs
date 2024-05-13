import _ from "lodash"
import SecretsManager from "./secrets-manager"
import retrieveSplOwnershipForEscrowMap from "../db-operations/read/spl-ownership/retrieve-spl-ownership-for-escrow-map"

export default class EscrowWalletManager {
	private static instance: EscrowWalletManager | null = null
	private tokenAccountMap: Map<string, number> = new Map()
	private lastFetchedTime: number = 0 // Last time the Escrow data was fetched from DB
	private secretsManagerInstance: SecretsManager

	private constructor() {
		this.secretsManagerInstance = SecretsManager.getInstance()
	}

	public static getInstance(): EscrowWalletManager {
		if (_.isNull(EscrowWalletManager.instance)) {
			EscrowWalletManager.instance = new EscrowWalletManager()
		}
		return EscrowWalletManager.instance
	}

	private get doesTokenAccountMapNeedRefresh(): boolean {
		const currentTime = Date.now()
		return this.lastFetchedTime < currentTime - 600000 // 1 hour
	}

	private getTokenAmountByPublicKey(publicKey: string): number | undefined {
		return this.tokenAccountMap.get(publicKey)
	}

	private async refreshTokenAccountMap(): Promise<void> {
		try {
			const escrowSolanaWalletId = await this.secretsManagerInstance.getSecret("FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB")
			const splOwnerships = await retrieveSplOwnershipForEscrowMap(parseInt(escrowSolanaWalletId, 10))

			splOwnerships.forEach(splOwnership => {
				this.tokenAccountMap.set(splOwnership.spl.public_key_address, splOwnership.number_of_shares)
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

	public async decrementTokenAmount(publicKey: string, decrementAmount: number): Promise<number> {
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
			return newAmount
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
