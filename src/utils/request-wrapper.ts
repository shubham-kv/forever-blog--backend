import {RequestHandler} from 'express'

export const requestWrapper =
	(requestHandler: RequestHandler): RequestHandler =>
		(req, res, next) => {
			try {
				requestHandler(req, res, next)
			} catch (e) {
				next(e)
			}
		}
