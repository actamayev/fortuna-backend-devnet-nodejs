import Joi from "joi"

const currencyValidatorSchema = Joi.string()
	.required()
	.trim()
	.valid("usd", "sol")

export default currencyValidatorSchema
