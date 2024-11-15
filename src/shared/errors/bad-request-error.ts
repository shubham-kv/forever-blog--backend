import {HttpError} from './http-error'

export class BadRequestError extends HttpError {
	constructor(message: string = 'Bad Request', data?: object) {
		super(400, message, data)
	}
}
