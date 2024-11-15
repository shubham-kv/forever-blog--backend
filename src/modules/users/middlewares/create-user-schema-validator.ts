import type {RequestHandler} from 'express'
import {CreateUserJoiSchema} from '../joi-schema'

import {schemaValidator} from '../../../shared/middlewares'

export const createUserSchemaValidator: RequestHandler = (req, _, next) =>
	schemaValidator({
		value: req.body,
		schema: CreateUserJoiSchema,
		onSuccess: next
	})
