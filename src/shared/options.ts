import Joi from 'joi'

export const joiSchemaValidationOptions: Joi.ValidationOptions = {
	abortEarly: true,
	errors: {
		wrap: {
			label: ''
		}
	},
	stripUnknown: true
}
