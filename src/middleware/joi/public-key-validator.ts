import Joi from "joi"
import bs58 from "bs58"

const publicKeyValidator = Joi.string().custom((value, helpers) => {
	try {
		const decoded = bs58.decode(value)
		if (decoded.length !== 32) { // Solana public keys should be 32 bytes long
			return helpers.error("any.invalid")
		}
	} catch (e) {
		return helpers.error("any.invalid")
	}
	return value // Return the value if validation passes
}, "Solana Public Key Validation")

export default publicKeyValidator
