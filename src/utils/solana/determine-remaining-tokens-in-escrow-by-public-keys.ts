import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"

export default async function determineRemainingTokensInEscrowByPublicKeys(splPublicKeys: string[]): Promise<{[key: string]: number}> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const results: {[key: string]: number} = {}

		const tokenAccounts = await connection.getTokenAccountsByOwner(
			new PublicKey(process.env.FORTUNA_ESCROW_WALLET_PUBLIC_KEY),
			{ programId: TOKEN_PROGRAM_ID }
		)

		const accounts = tokenAccounts.value.map(tokenAccount => {
			const accountData = AccountLayout.decode(tokenAccount.account.data)
			return {
				publicKey: new PublicKey(accountData.mint).toString(),
				amount: accountData.amount.toString()
			}
		})

		splPublicKeys.forEach(pubKey => {
			const account = accounts.find(acc => acc.publicKey === pubKey)
			results[pubKey] = account ? Number(account.amount) : 0
		})

		return results
	} catch (error) {
		console.error(error)
		throw error
	}
}
