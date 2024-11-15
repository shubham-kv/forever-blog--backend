import {NextFunction, Request, Response} from 'express'
import {CreatePostSchema} from '../joi-schemas'

import {schemaValidator} from '../../../shared/middlewares'
import {buildErrorResponse} from '../../../utils'

export const createPostBodyValidator = (
	req: Request,
	res: Response,
	next: NextFunction
) =>
	schemaValidator({
		schema: CreatePostSchema,
		value: req.body,
		onSuccess: next,
		onFailure: (error) => res.status(400).json(buildErrorResponse(error))
	})
