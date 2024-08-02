import Joi from "joi"
import bs58 from "bs58"
import { PublicKey } from "@solana/web3.js"

// Custom validator for Solana public keys
const publicKeyValidator = Joi.string().custom((value, helpers) => {
	try {
		const decoded = bs58.decode(value)

		// Solana public keys should be 32 bytes long
		if (decoded.length !== 32) {
			return helpers.error("any.invalid")
		}

		// Check if the public key is on the curve
		if (!PublicKey.isOnCurve(decoded)) {
			return helpers.error("any.invalid")
		}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return helpers.error("any.invalid")
	}
	return value // Return the value if validation passes
}, "Solana Public Key Validation")

export default publicKeyValidator
