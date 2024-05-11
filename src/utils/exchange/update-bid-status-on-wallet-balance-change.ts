import { PublicKey } from "@solana/web3.js"
import { getWalletBalanceWithUSD } from "../solana/get-wallet-balance"
import updateExistingBidsToAdjustToFundReqs from "../../db-operations/write/secondary-market/update-existing-bids-to-adjust-to-fund-reqs"

export default async function updateBidStatusOnWalletBalanceChange(solanaWallet: ExtendedSolanaWallet): Promise<void> {
	try {
		const remainingWalletBalanceUsd = await getWalletBalanceWithUSD(new PublicKey(solanaWallet.public_key))
		await updateExistingBidsToAdjustToFundReqs(solanaWallet.solana_wallet_id, remainingWalletBalanceUsd.balanceInUsd)
	} catch (error) {
		console.error(error)
		throw error
	}
}
