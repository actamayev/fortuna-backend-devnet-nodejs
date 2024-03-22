import { Connection, clusterApiUrl } from "@solana/web3.js"
import { Metaplex, Nft, keypairIdentity } from "@metaplex-foundation/js"
import get51SolanaWalletFromSecretKey from "./get-51-solana-wallet-from-secret-key"

// TODO: Need to extract the transaction fee. Transitio n to using SPLs
export default async function mintSolanaNFT (
	metadataJSONUrl: string,
	uploadNFTData: UploadNFT
): Promise<Nft | void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"))
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()

		const metaplex = Metaplex.make(connection)
			.use(keypairIdentity(fiftyoneWallet))

		const { nft } = await metaplex.nfts().create({
			uri: metadataJSONUrl,
			name: uploadNFTData.nftName,
			// FUTURE TODO: Seller fee Basis points could be a way for the asset to have cash flow (to the buyers of the initial offering).
			// Value will accrue to the initial shareholders who continue to hold their shares
			// The main problem is that the sellerfee applies to a wallet, not to the holder of NFTs
			sellerFeeBasisPoints: 0,
			isMutable: false
		})

		return nft
	} catch (error) {
		console.error(error)
	}
}
