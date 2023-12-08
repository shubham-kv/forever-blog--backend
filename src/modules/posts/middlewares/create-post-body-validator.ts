import {RequestHandler} from 'express'
import {CreatePostSchema} from '../joi-schemas'

import {schemaValidator} from '../../../shared/middlewares'

export const createPostBodyValidator: RequestHandler = (req, _res, next) =>
	schemaValidator({
		schema: CreatePostSchema,
		value: req.body,
		onSuccess: next
	})
