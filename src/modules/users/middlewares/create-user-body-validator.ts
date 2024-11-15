import type {NextFunction, Request, Response} from 'express'
import {schemaValidator} from '../../../shared/middlewares'
import {CreateUserJoiSchema} from '../joi-schema'

import type {ErrorResult} from '../../../shared/types'

export function createUserBodyValidator(
	req: Request,
	res: Response,
	next: NextFunction
) {
	return schemaValidator({
		value: req.body,
		schema: CreateUserJoiSchema,
		onSuccess: next,
		onFailure(error) {
			const result: ErrorResult = {
				success: false,
				error: error
			}
			return res.status(400).json(result)
		}
	})
}
