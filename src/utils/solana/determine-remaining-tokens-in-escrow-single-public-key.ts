import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"

export default async function determineRemainingTokensInEscrowSinglePublicKey(splPublicKey: string): Promise<number> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const targetPublicKey = new PublicKey(splPublicKey)
		const tokenAccounts = await connection.getTokenAccountsByOwner(
			new PublicKey(process.env.FORTUNA_ESCROW_WALLET_PUBLIC_KEY),
			{ programId: TOKEN_PROGRAM_ID }
		)

		for (const tokenAccount of tokenAccounts.value) {
			const accountData = AccountLayout.decode(tokenAccount.account.data)
			const accountPublicKey = new PublicKey(accountData.mint)
			if (accountPublicKey.equals(targetPublicKey)) {
				return parseInt(accountData.amount.toString(), 10)  // Convert BigInt to number immediately
			}
		}

		return 0
	} catch (error) {
		console.error(error)
		throw error
	}
}
