import _ from "lodash"
import { Request, Response } from "express"
import getSolPriceInUSD from "../../../utils/solana/get-sol-price-in-usd"
import determineTransactionFee from "../../../utils/solana/determine-transaction-fee"

export default async function getTransactionFees(req: Request, res: Response): Promise<Response> {
	try {
		const transactionSignatures = req.body as string[]

		const solPriceInUSD = await getSolPriceInUSD()
		if (_.isNull(solPriceInUSD)) return res.status(400).json({ message: "Unable to retrieve Sol Price in USD" })

		const transactionFees = await Promise.all(transactionSignatures.map(async (signature) => {
			const result = await determineTransactionFee(signature, "devnet", solPriceInUSD)
			return {
				signature,
				...result
			}
		}))

		if (_.isEmpty(transactionFees)) {
			return res.status(400).json({ message: "Unable to determine Transaction Fees for any of the transactions" })
		}

		return res.status(200).json(transactionFees)
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal Server Error: Unable to Get Transaction Fee" })
	}
}
