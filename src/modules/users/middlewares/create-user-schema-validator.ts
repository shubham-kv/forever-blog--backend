import type {NextFunction, Request, Response} from 'express'
import {CreateUserJoiSchema} from '../joi-schema'

import {schemaValidator} from '../../../shared/middlewares'
import {buildErrorResponse} from '../../../utils'

export const createUserSchemaValidator = (
	req: Request,
	res: Response,
	next: NextFunction
) =>
	schemaValidator({
		value: req.body,
		schema: CreateUserJoiSchema,
		onSuccess: next,
		onFailure: (error) => res.status(400).json(buildErrorResponse(error))
	})
