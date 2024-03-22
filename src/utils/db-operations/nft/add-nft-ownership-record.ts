import { nft } from "@prisma/client"
import prismaClient from "../../../prisma-client"
import get51SolanaWalletFromSecretKey from "../../solana/get-51-solana-wallet-from-secret-key"

export default async function addNFTOwnershipRecord (newNft: nft): Promise<void> {
	try {
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()

		await prismaClient.nft_ownership.create({
			data: {
				nft_id: newNft.nft_id,
				solana_wallet_id: fiftyoneWallet.publicKey  // TODO: find 51 crypto's wallet id
			}
		})
	} catch (error) {
		console.error(error)
	}
}
