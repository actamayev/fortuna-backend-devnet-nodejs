import { spl } from "@prisma/client"
import { PublicKey } from "@solana/web3.js"
import prismaClient from "../../../prisma-client"
import { findSolanaWalletByPublicKey } from "../../find/find-solana-wallet"
import get51SolanaWalletFromSecretKey from "../../solana/get-51-solana-wallet-from-secret-key"
import _ from "lodash"

export default async function addSPLRecord (
	metadataJSONUrl: string,
	newSPLData: NewSPLData,
	splTokenPublicKey: PublicKey,
	creatorWalletId: number
): Promise<spl | void> {
	try {
		// TODO: Remove these three lines. the fiftyoneWalletDB can be passed into this function.
		// It is also being called in assignSPLTokenShares
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()
		const fiftyoneWalletDB = await findSolanaWalletByPublicKey(fiftyoneWallet.publicKey, "DEVNET")
		if (_.isNull(fiftyoneWalletDB) || fiftyoneWalletDB === undefined) return

		// TODO: Fix the blank fields
		const addSPLResponse = await prismaClient.spl.create({
			data: {
				meta_data_url: metadataJSONUrl,
				file_name: newSPLData.fileName,
				spl_name: newSPLData.splName,
				chain_address: "",
				meta_data_address: "",
				public_key_address: splTokenPublicKey.toString(),
				listing_price: newSPLData.offeringSharePrice,
				blockchain_mint_fee: 0,
				payer_solana_wallet_id: fiftyoneWalletDB.solana_wallet_id,
				total_number_of_shares: newSPLData.numberOfShares,
				description: newSPLData.description,
				spl_listing_status: "LISTED",
				creator_wallet_id: creatorWalletId
			}
		})

		return addSPLResponse
	} catch (error) {
		console.error(error)
	}
}
