import {RequestHandler} from 'express'

export const requestWrapper =
	(requestHandler: RequestHandler): RequestHandler =>
		async (req, res, next) => {
			try {
				await requestHandler(req, res, next)
			} catch (e) {
				next(e)
			}
		}
