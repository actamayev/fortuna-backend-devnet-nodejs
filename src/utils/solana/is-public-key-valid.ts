import _ from "lodash"
import bs58 from "bs58"

export default function isPublicKeyValid(publicKey: string): boolean {
	try {
		const decoded = bs58.decode(publicKey)
		if (!_.isEqual(decoded.length, 32)) { // Solana public keys should be 32 bytes long
			return false
		}
		return true
	} catch (e) {
		return false
	}
}
