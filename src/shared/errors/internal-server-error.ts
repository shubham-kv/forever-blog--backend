import {HttpError} from './http-error'

export class InternalServerError extends HttpError {
	constructor(message: string = 'InternalServerError') {
		super(500, message)
	}
}
