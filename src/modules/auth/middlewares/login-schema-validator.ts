import type {NextFunction, Request, Response} from 'express'

import {LoginSchema} from '../schemas'
import {schemaValidator} from '../../../shared/middlewares'
import {buildErrorResponse} from '../../../utils'

export const loginSchemaValidator = (
	req: Request,
	res: Response,
	next: NextFunction
) =>
	schemaValidator({
		schema: LoginSchema,
		value: req.body,
		onSuccess: next,
		onFailure: (error) => res.status(400).json(buildErrorResponse(error))
	})
