import { credentials, solana_wallet } from "@prisma/client"
import Encryptor from "../../classes/encryptor"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateYouTubeTokenData(data: any): data is RetrievedYouTubeAccessTokensData {
	try {
		return Encryptor.isNonDeterminsticEncryptedString(data.refresh_token__encrypted)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export function validateExtendedCredentials(data: credentials): data is ExtendedCredentials {
	try {
		const isValidEmailEncrypted = data.email__encrypted === null || Encryptor.isDeterministicEncryptedString(data.email__encrypted)
		const isValidPhoneNumberEncrypted = data.phone_number__encrypted === null ||
			Encryptor.isDeterministicEncryptedString(data.phone_number__encrypted)

		return isValidEmailEncrypted && isValidPhoneNumberEncrypted
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
