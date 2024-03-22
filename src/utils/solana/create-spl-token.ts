import { solana_wallet } from "@prisma/client"
import { base58 } from "@metaplex-foundation/umi/serializers"
import { createSignerFromKeypair } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { createMetadataAccountV3 } from "@metaplex-foundation/mpl-token-metadata"
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token"
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters"
import get51SolanaWalletFromSecretKey from "./get-51-solana-wallet-from-secret-key"

// TODO: Make sure all of this data is being added to DB somewhere (mint creation, token account creation)
// TODO: Need to extract the transaction fee. Transition to using SPLs
// eslint-disable-next-line max-lines-per-function
export default async function createSPLToken (
	metadataJSONUrl: string,
	uploadSplData: NewSPLData,
	creatorWallet: solana_wallet
): Promise<PublicKey | void> {
	try {
		const connection = new Connection(clusterApiUrl("devnet"))
		const fiftyoneWallet = get51SolanaWalletFromSecretKey()

		const mint = await createMint(
			connection,
			fiftyoneWallet,
			fiftyoneWallet.publicKey,
			null,
			0
		)

		await createTokenMetadata(mint, metadataJSONUrl, uploadSplData)

		const creatorPublicKey = new PublicKey(creatorWallet.public_key)

		// TODO: Simulate transaction via the connection.simulateTransaction. Convert to feeinLamports, and then fee in Sol.

		// This is where the share distribution should take place
		// const tokenAccount = await getOrCreateAssociatedTokenAccount(
		// 	connection,
		// 	fiftyoneWallet,
		// 	mint,
		// 	creatorPublicKey
		// )

		// const mintTransactionSignature = await mintTo(
		// 	connection,
		// 	fiftyoneWallet,
		// 	mint,
		// 	creatorPublicKey,
		// 	fiftyoneWallet,
		// 	1
		// )
		return mint
	} catch (error) {
		console.error(error)
	}
}

async function createTokenMetadata(
	mint: PublicKey,
	metadataJSONUrl: string,
	uploadSplData: NewSPLData
): Promise<[string, number]> {
	const endpoint = clusterApiUrl("devnet")
	const fiftyoneWallet = get51SolanaWalletFromSecretKey()

	const umi = createUmi(endpoint)

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
			name: uploadSplData.splName,
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
}
