import {RequestHandler} from 'express'
import {middlewareWrapper} from './middleware-wrapper'

export const applyMiddlewareWrapper = (...middlewares: RequestHandler[]) =>
	middlewares.map((middleware) => middlewareWrapper(middleware))
