import { credentials, solana_wallet } from "@prisma/client"
import Hash from "../../classes/hash"
import Encryptor from "../../classes/encryptor"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateYouTubeTokenData(data: any): data is RetrievedYouTubeAccessTokensData {
	try {
		return Encryptor.isEncryptedString(data.refresh_token__encrypted)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export function validateExtendedCredentials(data: credentials): data is ExtendedCredentials {
	try {
		const isValidEmailEncrypted = data.email__encrypted === null || Encryptor.isEncryptedString(data.email__encrypted)
		const isValidPhoneNumberEncrypted = data.phone_number__encrypted === null ||
			Encryptor.isEncryptedString(data.phone_number__encrypted)
		const isValidEmailHashed = data.email__hashed === null || Hash.isHashedString(data.email__hashed)
		const isValidPhoneNumberHashed = data.phone_number__hashed === null || Hash.isHashedString(data.phone_number__hashed)

		return isValidEmailEncrypted && isValidPhoneNumberEncrypted && isValidEmailHashed && isValidPhoneNumberHashed
	} catch (error) {
		console.error(error)
		throw error
	}
}

export function validateExtendedSolanaWallet(data: solana_wallet): data is ExtendedSolanaWallet {
	try {
		// TODO: Remove this as string after migrations are over
		return Encryptor.isEncryptedString(data.secret_key__encrypted as string)
	} catch (error) {
		console.error(error)
		throw error
	}
}
