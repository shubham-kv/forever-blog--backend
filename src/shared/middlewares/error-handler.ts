import {ErrorRequestHandler} from 'express'

import {HttpError} from '../errors'
import {buildErrorResponse} from '../../utils'
import {SERVER_ERROR_MESSAGE} from '../constants'

export const errorHandler: ErrorRequestHandler = (err, _req, res) => {
	const statusCode =
		err instanceof HttpError ? err.status : res.statusCode ?? 500
	const errorMessage =
		err instanceof HttpError ? err.message : SERVER_ERROR_MESSAGE

	res.status(statusCode).json(buildErrorResponse(errorMessage))
	console.error(err)
}
