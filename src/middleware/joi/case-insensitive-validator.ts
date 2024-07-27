import Joi, { Extension } from "joi"

const caseInsensitiveUniqueExtension: Extension = {
	type: "array",
	base: Joi.array(),
	messages: {
		"array.uniqueCaseInsensitive": "{{#label}} must not contain duplicate values (case-insensitive)"
	},
	rules: {
		uniqueCaseInsensitive: {
			method() {
				return this.$_addRule({ name: "uniqueCaseInsensitive" })
			},
			validate(value: string[], helpers) {
				const lowerCasedValues = value.map(val => val.toLowerCase())
				const uniqueValues = Array.from(new Set(lowerCasedValues))

				if (uniqueValues.length !== value.length) {
					return helpers.error("array.uniqueCaseInsensitive")
				}

				return value
			}
		}
	}
}

const customJoi = Joi.extend(caseInsensitiveUniqueExtension)

export default customJoi
