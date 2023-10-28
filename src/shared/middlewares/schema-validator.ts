import Joi from 'joi'
import {joiSchemaValidationOptions} from '../options'

type Properties = {
	value: unknown
	schema: Joi.Schema
	onSuccess: () => void
	onFailure: (error: string) => void
}

export const schemaValidator = (props: Properties) => {
	const {value, schema, onSuccess, onFailure} = props
	const {error} = schema.validate(value, joiSchemaValidationOptions)

	if (error) {
		return onFailure(error.message)
	}

	onSuccess()
}
