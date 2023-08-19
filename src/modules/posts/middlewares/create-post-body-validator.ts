import {NextFunction, Request, Response} from 'express'
import {CreatePostSchema} from '../joi-schemas'

import {joiSchemaValidationOptions} from '../../../shared/options'
import {Result} from '../../../shared/types'

export const createPostBodyValidator = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const value = req.body
	const schema = CreatePostSchema

	const {error} = schema.validate(value, joiSchemaValidationOptions)

	if (error) {
		const statusCode: number = 400
		const result: Result<undefined, string> = {
			success: false,
			error: error.message
		}

		return res.status(statusCode).json(result)
	}

	next()
}
