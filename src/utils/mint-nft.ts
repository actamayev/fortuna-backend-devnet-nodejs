import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js"
import { Metaplex, Nft, keypairIdentity } from "@metaplex-foundation/js"

export default async function mintNFT (metadataUrl: string, secretKey: Uint8Array): Promise<Nft | undefined> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"))
		const wallet = Keypair.fromSecretKey(secretKey)

		const metaplex = Metaplex.make(connection)
			.use(keypairIdentity(wallet))

		const { nft } = await metaplex.nfts().create({
			uri: metadataUrl,
			name: "Tiger 1",
			sellerFeeBasisPoints: 0
		})

		return nft
	} catch (error) {
		console.error(error)
	}
}
