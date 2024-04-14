import { Request, Response } from "express"
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"

// This endpoint is currently soley for internal use
export default async function getNumberOfTokensInTokenAccount(req: Request, res: Response): Promise<Response> {
	try {
		const publicKey = req.params.publicKey
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const tokenAccounts = await connection.getTokenAccountsByOwner(
			new PublicKey(publicKey),
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

		return res.status(200).json({ accounts })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Retrieve number of tokens" })
	}
}
