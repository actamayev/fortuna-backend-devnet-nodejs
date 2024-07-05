import Joi from "joi"
import { SocialPlatforms } from "@prisma/client"

// Ensure the enum values are correctly typed
const validSocialPlatforms: string[] = Object.values(SocialPlatforms) as string[]

// Custom Joi validation method
const socialPlatformValidator = (value: string, helpers: Joi.CustomHelpers): string | Joi.ErrorReport => {
	if (!validSocialPlatforms.includes(value)) {
		return helpers.error("any.invalid")
	}
	return value
}

export default socialPlatformValidator
