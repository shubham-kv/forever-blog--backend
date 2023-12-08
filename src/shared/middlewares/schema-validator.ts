import Joi from 'joi'
import {joiSchemaValidationOptions} from '../options'
import {BadRequestError} from '../errors'

type Properties = {
	value: unknown
	schema: Joi.Schema
	onSuccess: () => void
	onFailure?: (error: string) => void
}

const defaultOnFailure = (error: string) => {
	throw new BadRequestError(error)
}

export const schemaValidator = (props: Properties) => {
	const {value, schema, onSuccess, onFailure = defaultOnFailure} = props
	const {error} = schema.validate(value, joiSchemaValidationOptions)

	if (error) {
		return onFailure(error.message)
	}

	onSuccess()
}
