import { nft, spl } from "@prisma/client"
import { PublicKey } from "@solana/web3.js"
import prismaClient from "../../../prisma-client"

export default async function addSPLRecord (newNft: nft, splTokenPublicKey: PublicKey): Promise<spl | void> {
	try {
		const addSPLResponse = await prismaClient.spl.create({
			data: {
				nft_id: newNft.nft_id,
				public_key_address: splTokenPublicKey.toString()
			}
		})

		return addSPLResponse
	} catch (error) {
		console.error(error)
	}
}
