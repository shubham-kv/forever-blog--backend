import type {NextFunction, Request, Response} from 'express'
import {schemaValidator} from '../../../shared/middlewares'
import {CreateUserJoiSchema} from '../joi-schema'

import {buildErrorResponse} from '../../../utils'

export function createUserSchemaValidator(
	req: Request,
	res: Response,
	next: NextFunction
) {
	return schemaValidator({
		value: req.body,
		schema: CreateUserJoiSchema,
		onSuccess: next,
		onFailure(error) {
			return res.status(400).json(buildErrorResponse(error))
		}
	})
}
