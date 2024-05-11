import Joi from "joi"

const uuidValidator = Joi.string()
	.uuid({ version: "uuidv4" })
	.trim()

export default uuidValidator
