import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"

export default async function determineNumberOfTokensRemainingInEscrow(splPublicKey: string): Promise<number> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

		const tokenAccounts = await connection.getTokenAccountsByOwner(
			new PublicKey(process.env.FORTUNA_ESCROW_WALLET_PUBLIC_KEY),
			{ programId: TOKEN_PROGRAM_ID }
		)

		const accounts: {
			publicKey: string
			amount: string
		}[] = []
		tokenAccounts.value.forEach((tokenAccount) => {
			const accountData = AccountLayout.decode(tokenAccount.account.data)
			const accountDetails = {
				publicKey: new PublicKey(accountData.mint).toString(),  // Converting PublicKey to String for easy JSON handling
				amount: accountData.amount.toString()
			}
			accounts.push(accountDetails)  // Assuming 'accounts' is an array initialized earlier
		})

		const account = accounts.find(account1 => account1.publicKey === splPublicKey)
		return account ? Number(account.amount) : 0
	} catch (error) {
		console.error(error)
		throw error
	}
}
