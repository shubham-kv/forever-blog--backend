import type {NextFunction, Request, Response} from 'express'

import {LoginSchema} from '../schemas'
import {schemaValidator} from '../../../shared/middlewares'
import {buildErrorResponse} from '../../../utils'

export function loginSchemaValidator(
	req: Request,
	res: Response,
	next: NextFunction
) {
	return schemaValidator({
		value: req.body,
		schema: LoginSchema,
		onSuccess: next,
		onFailure(error) {
			return res.status(400).json(buildErrorResponse(error))
		}
	})
}
