import Joi from 'joi'
import {joiSchemaValidationOptions} from '../options'
import {BadRequestError} from '../errors'
import {logger} from '../../modules/logger'

type Properties = {
	value: unknown
	schema: Joi.Schema
	onSuccess: () => void
	onFailure?: (error: string) => void
}

const defaultOnFailure = (error: string, data?: object) => {
	throw new BadRequestError(error, data)
}

export const schemaValidator = (props: Properties) => {
	const {value, schema, onSuccess, onFailure = defaultOnFailure} = props
	const {error} = schema.validate(value, joiSchemaValidationOptions)

	if (error) {
		logger.error(error)
		return onFailure(error.message, {
			key: error.details[0].context?.key,
			message: error.details[0].message
		})
	}

	onSuccess()
}
