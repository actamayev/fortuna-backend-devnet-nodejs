import { Request, Response } from "express"
import { Connection, PublicKey } from "@solana/web3.js"
import { getClusterUrlByEnv } from "../../utils/solana/get-cluster-url-by-env"

export default async function getInboundTransferHistory(req: Request, res: Response): Promise<Response> {
	try {
		const { publicKey } = req.params

		const connection = new Connection(getClusterUrlByEnv(), "confirmed")
		const confirmedSignatures = await connection.getSignaturesForAddress(new PublicKey(publicKey))

		// Fetch confirmed transactions and filter for transfer instructions
		const transfers = await Promise.all(
			confirmedSignatures.map(async (signatureInfo) => {
				return await connection.getTransaction(signatureInfo.signature, {
					commitment: "confirmed",
					maxSupportedTransactionVersion: 0
				})
			})
		)

		return res.status(200).json({ transfers })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Get inbound transfer history" })
	}
}
