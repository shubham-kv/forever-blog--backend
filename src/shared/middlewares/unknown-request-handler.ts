import {RequestHandler} from 'express'
import {NotFoundError} from '../errors'

export const unknownRequestHandler: RequestHandler = (req) => {
	throw new NotFoundError(`Cannot ${req.method} ${req.baseUrl}`)
}
