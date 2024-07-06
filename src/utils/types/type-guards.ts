import { credentials, solana_wallet } from "@prisma/client"
import Encryptor from "../../classes/encryptor"

export function validateYouTubeTokenData(data: RetrievedYouTubeAccessTokensData): data is TypedRetrievedYouTubeAccessTokensData {
	try {
		return Encryptor.isNonDeterminsticEncryptedString(data.refresh_token__encrypted)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export function validateExtendedCredentials(data: credentials): data is ExtendedCredentials {
	try {
		return Encryptor.isDeterministicEncryptedString(data.email__encrypted)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export function validateExtendedSolanaWallet(data: solana_wallet): data is ExtendedSolanaWallet {
	try {
		return Encryptor.isNonDeterminsticEncryptedString(data.secret_key__encrypted)
	} catch (error) {
		console.error(error)
		throw error
	}
}
