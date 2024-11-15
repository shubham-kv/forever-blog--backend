import {ErrorRequestHandler} from 'express'

import {logger} from '../../modules/logger'
import {HttpError} from '../errors'
import {buildErrorResponse} from '../../utils'

import {SERVER_ERROR_MESSAGE} from '../constants'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	const statusCode =
		err instanceof HttpError ? err.status : res.statusCode ?? 500
	const errorMessage = err.message ?? SERVER_ERROR_MESSAGE
	const obj = err instanceof HttpError ? err.data : {}

	logger.error(err.toString())
	res.status(statusCode).json(buildErrorResponse(errorMessage, obj))
}
