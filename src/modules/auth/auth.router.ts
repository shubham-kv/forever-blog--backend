import {Router} from 'express'

import * as authController from './auth.controller'
import {
	loginSchemaValidator,
	loginCredentialsValidator,
	refreshGuard
} from './middlewares'

import {applyMiddlewareWrapper} from '../../utils'

export const authRouter = Router()

const loginMiddlewares = applyMiddlewareWrapper(
	loginSchemaValidator,
	loginCredentialsValidator,
	authController.login
)

const refreshMiddlewares = applyMiddlewareWrapper(
	refreshGuard,
	authController.refresh
)

authRouter.route('/login').post(...loginMiddlewares)
authRouter.route('/refresh').post(...refreshMiddlewares)
