import Joi from "joi"

const idValidator = Joi.number().strict().integer()

export default idValidator
