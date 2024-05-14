import _ from "lodash"
import { PublicKey } from "@solana/web3.js"
import SecretsManager from "./secrets-manager"
import retrieveSplOwnershipForEscrowMap from "../db-operations/read/spl-ownership/retrieve-spl-ownership-for-escrow-map"

export default class EscrowWalletManager {
	private static instance: EscrowWalletManager | null = null
	private splMap: Map<string, number> = new Map() // Maps the spl Public Key to the number of shares held in escrow.
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

	private get doessplMapNeedRefresh(): boolean {
		const currentTime = Date.now()
		return this.lastFetchedTime < currentTime - 600000 // 1 hour
	}

	private getTokenQuantityByPublicKey(publicKey: string): number | undefined {
		return this.splMap.get(publicKey)
	}

	private async refreshSplMap(): Promise<void> {
		try {
			const escrowSolanaWalletId = await this.secretsManagerInstance.getSecret("FORTUNA_ESCROW_TOKEN_HOLDER_WALLET_ID_DB")
			const sharesMap = await retrieveSplOwnershipForEscrowMap(parseInt(escrowSolanaWalletId, 10))

			this.splMap.clear()
			sharesMap.forEach((shares, publicKey) => this.splMap.set(publicKey, shares))

			this.lastFetchedTime = Date.now()
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public async retrieveTokenAmountByPublicKey(publicKey: string): Promise<number> {
		try {
			if (
				this.doessplMapNeedRefresh ||
				_.isUndefined(this.getTokenQuantityByPublicKey(publicKey))
			) {
				await this.refreshSplMap()
			}
			return this.getTokenQuantityByPublicKey(publicKey) || 0
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public async retrieveTokenAmountsByPublicKeys(publicKeys: string[]): Promise<{ [key: string]: number }> {
		try {
			let needsRefresh = this.doessplMapNeedRefresh

			const result: { [key: string]: number } = {}

			for (const publicKey of publicKeys) {
				const amount = this.getTokenQuantityByPublicKey(publicKey)
				if (_.isUndefined(amount)) {
					needsRefresh = true
					break
				}
				result[publicKey] = amount
			}

			if (needsRefresh === true) {
				await this.refreshSplMap()
				publicKeys.forEach(publicKey => {
					result[publicKey] = this.getTokenQuantityByPublicKey(publicKey) || 0
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
			let currentAmount = this.splMap.get(publicKey)
			if (_.isUndefined(currentAmount)) {
				await this.refreshSplMap()
				currentAmount = this.splMap.get(publicKey)
				if (_.isUndefined(currentAmount)) {
					throw Error("Unable to find Token amount")
				}
			}
			const newAmount = Math.max(0, currentAmount - decrementAmount)
			this.splMap.set(publicKey, newAmount)
			return newAmount
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	public addSplToMap(publicKey: PublicKey, numberShares: number): void {
		try {
			const currentAmount = this.splMap.get(publicKey.toString())
			if (!_.isUndefined(currentAmount)) throw Error("Public Key already exists in map")
			this.splMap.set(publicKey.toString(), numberShares)
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
