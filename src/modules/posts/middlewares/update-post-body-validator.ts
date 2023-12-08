import {RequestHandler} from 'express'
import {UpdatePostSchema} from '../joi-schemas'

import {schemaValidator} from '../../../shared/middlewares'

export const updatePostBodyValidator: RequestHandler = (req, _res, next) =>
	schemaValidator({
		schema: UpdatePostSchema,
		value: req.body,
		onSuccess: next
	})
