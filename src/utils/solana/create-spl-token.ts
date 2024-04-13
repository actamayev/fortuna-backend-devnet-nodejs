import { createMint } from "@solana/spl-token"
import { base58 } from "@metaplex-foundation/umi/serializers"
import { createSignerFromKeypair } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata"
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters"
import getWalletBalance from "./get-wallet-balance"
import getFortunaSolanaWalletFromSecretKey from "./get-fortuna-solana-wallet-from-secret-key"

export default async function createSPLToken (metadataJSONUrl: string, splName: string): Promise<CreateSPLResponse> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
		const fortunaWallet = getFortunaSolanaWalletFromSecretKey()

		const initialWalletBalance = await getWalletBalance("devnet", process.env.FORTUNA_WALLET_PUBLIC_KEY)

		const mint = await createMint(
			connection,
			fortunaWallet,
			fortunaWallet.publicKey,
			null,
			0
		)
		const secondWalletBalance = await getWalletBalance("devnet", process.env.FORTUNA_WALLET_PUBLIC_KEY)

		const feeInSol = initialWalletBalance.balanceInSol - secondWalletBalance.balanceInSol

		const metadataTransactionSignature = await createTokenMetadata(mint, metadataJSONUrl, splName)

		return { mint, metadataTransactionSignature, feeInSol }
	} catch (error) {
		console.error(error)
		throw error
	}
}

// eslint-disable-next-line max-lines-per-function
async function createTokenMetadata(
	mint: PublicKey,
	metadataJSONUrl: string,
	splName: string
): Promise<string> {
	try {
		const endpoint = clusterApiUrl("devnet")
		const fortunaWallet = getFortunaSolanaWalletFromSecretKey()

		const umi = createUmi(endpoint, "confirmed")

		const keypair = fromWeb3JsKeypair(fortunaWallet)
		const signer = createSignerFromKeypair(umi, keypair)
		umi.identity = signer
		umi.payer = signer

		const createMetadataAccountV3Args = {
			mint: fromWeb3JsPublicKey(mint),
			mintAuthority: signer,
			payer: signer,
			updateAuthority: keypair.publicKey,
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
		const transactionSignature = await umi.rpc.sendTransaction(transaction)
		const signature = base58.deserialize(transactionSignature)

		return signature[0]
	} catch (error) {
		console.error(error)
		throw error
	}
}
