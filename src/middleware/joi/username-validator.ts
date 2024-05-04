import Joi from "joi"

const usernameValidator = Joi.string().custom((value, helpers) => {
	// Regular expression to exclude #, ?, &, /, and @
	if (/[#?&/@]/.test(value)) {
		return helpers.error("string.invalidUsername", { value })
	}
	return value // Return the value if validation passes
}, "Username Validation").messages({
	"string.invalidUsername": "\"{{#label}}\" cannot include special characters: #, ?, &, /, or @"
})

export default usernameValidator
