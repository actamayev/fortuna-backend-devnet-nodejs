import { createMint } from "@solana/spl-token"
import { base58 } from "@metaplex-foundation/umi/serializers"
import { createSignerFromKeypair } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata"
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters"
import get51SolanaWalletFromSecretKey from "./get-51-solana-wallet-from-secret-key"

// TODO: Need to extract the transaction fee. Transition to using SPLs
export default async function createSPLToken (
	metadataJSONUrl: string,
	splName: string,
): Promise<PublicKey | void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()

		const mint = await createMint(
			connection,
			fiftyoneWallet,
			fiftyoneWallet.publicKey,
			null,
			0
		)

		const transactionSignature = await createTokenMetadata(mint, metadataJSONUrl, splName)

		if (transactionSignature === undefined) return

		// TODO: Simulate transaction via the connection.simulateTransaction. Convert to feeinLamports, and then fee in Sol.
		return mint
	} catch (error) {
		console.error(error)
	}
}

// eslint-disable-next-line max-lines-per-function
async function createTokenMetadata(
	mint: PublicKey,
	metadataJSONUrl: string,
	splName: string
): Promise<[string, number] | void> {
	try {
		const endpoint = clusterApiUrl("devnet")
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()

		const umi = createUmi(endpoint, "confirmed")

		const keypair = fromWeb3JsKeypair(fiftyoneWallet)
		const signer = createSignerFromKeypair(umi, keypair)
		umi.identity = signer
		umi.payer = signer

		const createMetadataAccountV3Args = {
			mint: fromWeb3JsPublicKey(mint),
			mintAuthority: signer,
			payer: signer,
			updateAuthority: fromWeb3JsKeypair(fiftyoneWallet).publicKey,
			data: {
				name: splName,
				symbol: "",
				uri: metadataJSONUrl,
				sellerFeeBasisPoints: 0,
				creators: null,
				collection: null,
				uses: null
			},
			isMutable: false,
			collectionDetails: null,
		}

		const instruction = createMetadataAccountV3(
			umi,
			createMetadataAccountV3Args
		)

		const transaction = await instruction.buildAndSign(umi)
		// TODO: Extract the blockhash, convert to sol, and then dollars. Save the transactino fee to DB

		const transactionSignature = await umi.rpc.sendTransaction(transaction)
		const signature = base58.deserialize(transactionSignature)

		return signature
	} catch (error) {
		console.error(error)
	}
}
