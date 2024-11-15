import {RequestHandler} from 'express'

import {schemaValidator} from '../../../shared/middlewares'
import {ReqParamsWithIdSchema} from '../joi-schemas'

export const paramWithIdValidator: RequestHandler = (req, _res, next) =>
	schemaValidator({
		schema: ReqParamsWithIdSchema,
		value: req.params,
		onSuccess: next
	})
