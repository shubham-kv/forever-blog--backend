import type {RequestHandler} from 'express'

import {LoginSchema} from '../schemas'
import {schemaValidator} from '../../../shared/middlewares'

export const loginSchemaValidator: RequestHandler = (req, _res, next) =>
	schemaValidator({
		schema: LoginSchema,
		value: req.body,
		onSuccess: next
	})
