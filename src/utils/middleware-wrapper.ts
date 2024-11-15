import {RequestHandler} from 'express'

export const middlewareWrapper =
	(middleware: RequestHandler): RequestHandler =>
		async (req, res, next) => {
			try {
				await middleware(req, res, next)
			} catch (e) {
				next(e)
			}
		}
